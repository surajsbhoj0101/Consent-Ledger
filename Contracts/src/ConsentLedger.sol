// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract ConsentLedger {
    error TermsHashCannotBeNull();
    error CompanyWebsiteHashCannotBeNull();
    error ExplanationHashCannotBeNull();
    error InvalidSignature();
    error SignatureExpired();
    error NotCompanyOwner();
    error TermsNotLatest();

    //EVENTS
    event CompanyRegistered(
        bytes32 indexed companyWebsite,
        address indexed owner
    );

    event TermsUpdated(
        bytes32 indexed companyWebsite,
        bytes32 newTermsHash,
        string ipfsCid,
        uint256 timestamp
    );

    event ConsentSaved(
        address indexed user,
        bytes32 indexed companyWebsite,
        bytes32 oldTermsHash,
        bytes32 newTermsHash,
        uint256 timeStamp,
        bytes32 explanationHash,
        string ipfsCid
    );

    //STRUCTS
    struct ConsentRecord {
        bytes32 oldTermsHash;
        bytes32 newTermsHash;
        uint256 timeStamp;
        bytes32 explanationHash;
        string ipfsCid;
    }

    mapping(address => mapping(bytes32 => ConsentRecord)) public userRecords;

    mapping(address => uint256) public nonces;

    mapping(bytes32 => address) public companyOwner;
    mapping(bytes32 => bytes32) public latestTermsHash;

    bytes32 private constant DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );

    bytes32 private constant CONSENT_TYPEHASH =
        keccak256(
            "Consent(address user,bytes32 termsHash,bytes32 companyWebsiteHash,bytes32 explanationHash,uint256 nonce,uint256 deadline)"
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

    function registerCompany(bytes32 companyWebsiteHash) external {
        if (companyWebsiteHash == bytes32(0))
            revert CompanyWebsiteHashCannotBeNull();

        if (companyOwner[companyWebsiteHash] == address(0)) {
            companyOwner[companyWebsiteHash] = msg.sender;
            emit CompanyRegistered(companyWebsiteHash, msg.sender);
        }
    }

    function updateTerms(
        bytes32 companyWebsiteHash,
        bytes32 newTermsHash,
        string calldata ipfsCid
    ) external {
        if (companyOwner[companyWebsiteHash] != msg.sender)
            revert NotCompanyOwner();

        if (newTermsHash == bytes32(0)) revert TermsHashCannotBeNull();

        latestTermsHash[companyWebsiteHash] = newTermsHash;

        emit TermsUpdated(
            companyWebsiteHash,
            newTermsHash,
            ipfsCid,
            block.timestamp
        );
    }

    //EIP-712
    function _hashConsent(
        address user,
        bytes32 termsHash,
        bytes32 companyWebsiteHash,
        bytes32 explanationHash,
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
                            companyWebsiteHash,
                            explanationHash,
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
        (bytes32 r, bytes32 s, uint8 v) = abi.decode(
            signature,
            (bytes32, bytes32, uint8)
        );

        if (v != 27 && v != 28) return false;

        address recovered = ecrecover(digest, v, r, s);
        return recovered != address(0) && recovered == signer;
    }

    //User consent on certain Terms of service hash
    function hashConsentWithSignature(
        bytes32 termsHash,
        bytes32 companyWebsiteHash,
        bytes32 explanationHash,
        string calldata ipfsCid,
        uint256 deadline,
        bytes calldata signature
    ) external {
        if (block.timestamp > deadline) revert SignatureExpired();
        if (explanationHash == bytes32(0)) revert ExplanationHashCannotBeNull();

        if (termsHash != latestTermsHash[companyWebsiteHash])
            revert TermsNotLatest();

        uint256 nonce = nonces[msg.sender];

        bytes32 digest = _hashConsent(
            msg.sender,
            termsHash,
            companyWebsiteHash,
            explanationHash,
            nonce,
            deadline
        );

        if (!_verifySignature(msg.sender, digest, signature))
            revert InvalidSignature();

        nonces[msg.sender]++;

        ConsentRecord storage record = userRecords[msg.sender][
            companyWebsiteHash
        ];

        record.oldTermsHash = record.newTermsHash;
        record.newTermsHash = termsHash;
        record.timeStamp = block.timestamp;
        record.explanationHash = explanationHash;
        record.ipfsCid = ipfsCid;

        emit ConsentSaved(
            msg.sender,
            companyWebsiteHash,
            record.oldTermsHash,
            record.newTermsHash,
            record.timeStamp,
            record.explanationHash,
            record.ipfsCid
        );
    }

    //Getter function consentRecord
    function getUserCompanyHash(
        bytes32 companyWebsiteHash
    ) external view returns (ConsentRecord memory) {
        return userRecords[msg.sender][companyWebsiteHash];
    }
}
