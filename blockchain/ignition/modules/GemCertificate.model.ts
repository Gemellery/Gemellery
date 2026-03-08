import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const GemCertificateModule = buildModule("GemCertificateModule", (m) => {
    const initialOwner = m.getParameter("initialOwner", m.getAccount(0));
    const gemCertificate = m.contract("GemCertificate", [initialOwner]);
    return { gemCertificate };
});

export default GemCertificateModule;