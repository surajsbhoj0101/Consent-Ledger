// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract ConsentLedger {
    error TermsHashCannotBeNull();
    error CompanyIdentityHashCannotBeNull();
    error CompanyAlreadyRegistered();
    error CompanyNotRegistered();
    error TermsNotSet();
    error InvalidSignature();
    error InvalidSignatureLength();
    error SignatureExpired();
    error NotCompanyOwner();
    error TermsNotLatest();
    error ConsentAlreadyActive();
    error ConsentAlreadyRevoked();
    error ConsentExpired();
    error ConsentCooldownActive();
    error InvalidConsentDuration();

    //EVENTS
    event CompanyRegistered(
        bytes32 indexed companyIdentityHash,
        address indexed owner
    );

    event TermsUpdated(
        bytes32 indexed companyIdentityHash,
        bytes32 newTermsHash,
        string ipfsCid,
        uint256 timestamp
    );

    event ConsentGiven(
        address indexed user,
        bytes32 indexed companyIdentityHash,
        bytes32 termsHash,
        uint256 timestamp,
        string ipfsCid
    );

    event ConsentRevoked(
        address indexed user,
        bytes32 indexed companyIdentityHash,
        bytes32 termsHash,
        uint256 timestamp,
        string ipfsCid
    );

    // Kept for backward compatibility with existing indexers/listeners.
    event ConsentSaved(
        address indexed user,
        bytes32 indexed companyIdentityHash,
        bytes32 termsHash,
        uint256 timeStamp,
        string ipfsCid
    );

    //STRUCTS
    struct ConsentRecord {
        bytes32 termsHash;
        uint256 timeStamp;
        uint256 revokedAt;
        uint256 expiresAt;
        bool active;
        string ipfsCid;
    }

    mapping(address => mapping(bytes32 => ConsentRecord)) public userRecords;

    mapping(address => uint256) public nonces;

    mapping(bytes32 => address) public companyOwner;
    mapping(bytes32 => bytes32) public latestTermsHash;

    uint256 public constant RECONSENT_COOLDOWN = 1 hours;
    uint256 public constant MAX_CONSENT_DURATION_DAYS = 3650;

    bytes32 private constant DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );

    bytes32 private constant CONSENT_TYPEHASH =
        keccak256(
            "Consent(address user,bytes32 termsHash,bytes32 companyIdentityHash,uint256 consentDurationDays,uint256 nonce,uint256 deadline)"
        );

    bytes32 private immutable DOMAIN_SEPARATOR;

    constructor() {
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                DOMAIN_TYPEHASH,
                keccak256(bytes("ConsentLedger")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    function _validateCompanyIdentityHash(
        bytes32 companyIdentityHash
    ) internal pure {
        if (companyIdentityHash == bytes32(0))
            revert CompanyIdentityHashCannotBeNull();
    }

    function registerCompany(bytes32 companyIdentityHash) external {
        _validateCompanyIdentityHash(companyIdentityHash);

        if (companyOwner[companyIdentityHash] != address(0))
            revert CompanyAlreadyRegistered();

        companyOwner[companyIdentityHash] = msg.sender;
        emit CompanyRegistered(companyIdentityHash, msg.sender);
    }

    function updateTerms(
        bytes32 companyIdentityHash,
        bytes32 newTermsHash,
        string calldata ipfsCid
    ) external {
        _validateCompanyIdentityHash(companyIdentityHash);

        if (companyOwner[companyIdentityHash] != msg.sender)
            revert NotCompanyOwner();

        if (newTermsHash == bytes32(0)) revert TermsHashCannotBeNull();

        latestTermsHash[companyIdentityHash] = newTermsHash;

        emit TermsUpdated(
            companyIdentityHash,
            newTermsHash,
            ipfsCid,
            block.timestamp
        );
    }

    //EIP-712
    function _hashConsent(
        address user,
        bytes32 termsHash,
        bytes32 companyIdentityHash,
        uint256 consentDurationDays,
        uint256 nonce,
        uint256 deadline
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR,
                    keccak256(
                        abi.encode(
                            CONSENT_TYPEHASH,
                            user,
                            termsHash,
                            companyIdentityHash,
                            consentDurationDays,
                            nonce,
                            deadline
                        )
                    )
                )
            );
    }

    function _verifySignature(
        address signer,
        bytes32 digest,
        bytes calldata signature
    ) internal pure returns (bool) {
        if (signature.length != 65) revert InvalidSignatureLength();

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 32))
            v := byte(0, calldataload(add(signature.offset, 64)))
        }

        if (v != 27 && v != 28) return false;
        if (
            uint256(s) >
            0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0
        ) return false;

        address recovered = ecrecover(digest, v, r, s);
        return recovered != address(0) && recovered == signer;
    }

    function _ensureCompanyAndTerms(bytes32 companyIdentityHash) internal view {
        if (companyOwner[companyIdentityHash] == address(0))
            revert CompanyNotRegistered();
        if (latestTermsHash[companyIdentityHash] == bytes32(0)) revert TermsNotSet();
    }

    function _isConsentActive(
        ConsentRecord storage record
    ) internal view returns (bool) {
        return
            record.active &&
            (record.expiresAt == 0 || block.timestamp < record.expiresAt);
    }

    function _validateConsentDuration(uint256 consentDurationDays) internal pure {
        if (
            consentDurationDays == 0 ||
            consentDurationDays > MAX_CONSENT_DURATION_DAYS
        ) revert InvalidConsentDuration();
    }

    function _writeConsent(
        address user,
        bytes32 companyIdentityHash,
        bytes32 termsHash,
        uint256 consentDurationDays,
        string calldata ipfsCid
    ) internal {
        _validateConsentDuration(consentDurationDays);

        ConsentRecord storage record = userRecords[user][companyIdentityHash];
        bool currentlyActive = _isConsentActive(record);

        // After revocation, enforce a minimum waiting period before re-consent.
        if (
            !currentlyActive &&
            record.revokedAt != 0 &&
            block.timestamp < record.revokedAt + RECONSENT_COOLDOWN
        ) revert ConsentCooldownActive();

        if (currentlyActive && record.termsHash == termsHash)
            revert ConsentAlreadyActive();

        record.termsHash = termsHash;
        record.timeStamp = block.timestamp;
        record.revokedAt = 0;
        record.expiresAt = block.timestamp + (consentDurationDays * 1 days);
        record.active = true;
        record.ipfsCid = ipfsCid;

        emit ConsentGiven(
            user,
            companyIdentityHash,
            termsHash,
            block.timestamp,
            ipfsCid
        );

        emit ConsentSaved(
            user,
            companyIdentityHash,
            record.termsHash,
            record.timeStamp,
            record.ipfsCid
        );
    }

    function revokeConsent(
        bytes32 companyIdentityHash,
        string calldata ipfsCid
    ) external {
        _validateCompanyIdentityHash(companyIdentityHash);
        if (companyOwner[companyIdentityHash] == address(0)) revert CompanyNotRegistered();

        ConsentRecord storage record = userRecords[msg.sender][companyIdentityHash];
        if (!record.active) revert ConsentAlreadyRevoked();
        if (record.expiresAt != 0 && block.timestamp >= record.expiresAt)
            revert ConsentExpired();

        record.active = false;
        record.revokedAt = block.timestamp;
        record.timeStamp = block.timestamp;
        record.expiresAt = block.timestamp;
        record.ipfsCid = ipfsCid;

        emit ConsentRevoked(
            msg.sender,
            companyIdentityHash,
            record.termsHash,
            block.timestamp,
            ipfsCid
        );
    }

    // User consent is accepted only through EIP-712 signatures.
    function giveConsentWithSignature(
        bytes32 termsHash,
        bytes32 companyIdentityHash,
        uint256 consentDurationDays,
        string calldata ipfsCid,
        uint256 deadline,
        bytes calldata signature
    ) external {
        if (block.timestamp > deadline) revert SignatureExpired();
        _validateCompanyIdentityHash(companyIdentityHash);

        _ensureCompanyAndTerms(companyIdentityHash);

        if (termsHash != latestTermsHash[companyIdentityHash])
            revert TermsNotLatest();

        uint256 nonce = nonces[msg.sender];

        bytes32 digest = _hashConsent(
            msg.sender,
            termsHash,
            companyIdentityHash,
            consentDurationDays,
            nonce,
            deadline
        );

        if (!_verifySignature(msg.sender, digest, signature))
            revert InvalidSignature();

        nonces[msg.sender]++;

        _writeConsent(
            msg.sender,
            companyIdentityHash,
            termsHash,
            consentDurationDays,
            ipfsCid
        );
    }

    //Getter function consentRecord
    function getUserCompanyHash(
        bytes32 companyIdentityHash
    ) external view returns (ConsentRecord memory) {
        return userRecords[msg.sender][companyIdentityHash];
    }

    function hasActiveConsent(
        address user,
        bytes32 companyIdentityHash
    ) external view returns (bool) {
        ConsentRecord storage record = userRecords[user][companyIdentityHash];
        return
            record.active &&
            (record.expiresAt == 0 || block.timestamp < record.expiresAt);
    }
}
