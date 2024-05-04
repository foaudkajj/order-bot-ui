import { Client } from "basic-ftp";
import dotenv from "dotenv";

dotenv.config({ path: ".env.production" });
// FTP server configuration
const ftpConfig = {
  host: process.env.REACT_APP_ftp_host,
  user: process.env.REACT_APP_ftp_user,
  password: process.env.REACT_APP_ftp_password,
};

const localBuildPath = "./build.zip";
const ftpProjDirectory = "/public_html/";
const systemFileFolders = [
  ".",
  "..",
  ".htaccess",
  ".well-known",
  "cgi-bin",
  "node_modules",
];

// Initialize FTP client
const client = new Client();

try {
  // Connect to FTP server
  await client.access(ftpConfig);
} catch (error) {
  console.error("FTP connection error:", error);
}

console.log("Connected to FTP server");
const buildFiles = await client.list(ftpProjDirectory);

// remove all files/folders (system files/folders excluded).
const directoryContent = buildFiles.filter(
  (v) => !systemFileFolders.includes(v.name)
);

for await (const f of directoryContent) {
  const filePath = ftpProjDirectory + f.name;
  if (f.isDirectory) {
    // Remove the directory after all its contents are removed
    try {
      await client.removeDir(filePath);
      console.log(`directory ${filePath} successfully removed.`);
    } catch (error) {
      console.error("Error while removing directory:", filePath, error);
    }
  } else {
    // File, delete
    try {
      await client.remove(filePath);
      console.log(`file ${filePath} successfully removed.`);
    } catch (error) {
      console.error("Error while removing file:", filePath, error);
    }
  }
}

// Upload the build.zip to the remote directory
try {
  await client.uploadFrom(localBuildPath, ftpProjDirectory + localBuildPath);
  console.log("build.zip uploaded successfully");
  console.log(
    "-------------------------------------------WARN-------------------------------------------------"
  );
  console.warn(
    "Don't forget to navigate to the following link to extract the zip file and restart the node instance. https://musteri.isimkaydet.com/login"
  );
  console.log(
    "-------------------------------------------WARN-------------------------------------------------"
  );
} catch (error) {
  console.error("Error uploading build.zip:", error);
} finally {
  console.log("FTP connection closed.");
  client.close();
}
