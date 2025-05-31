import Client from "ssh2-sftp-client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.production" });
// SFTP server configuration
const sftpConfig = {
  host: process.env.REACT_APP_droplet_sftp_host,
  user: process.env.REACT_APP_droplet_sftp_user,
  password: process.env.REACT_APP_droplet_sftp_password,
};

const localBuildPath = "./build";
const projDirectory = "/var/www/html/";

// Initialize SFTP client
const client = new Client();

try {
  // Connect to SFTP server
  await client.connect(sftpConfig);
} catch (error) {
  console.error("SFTP connection error:", error);
}

console.log("Connected to SFTP server");
const ftpProjDirectoryExists = await client.exists(projDirectory);
if (!ftpProjDirectoryExists) {
  await client.mkdir(projDirectory, true);
} else {
  // remove the contents of the directory
  await client.rmdir(projDirectory, true);
  await client.mkdir(projDirectory, true);
}

// Upload the build.zip to the remote directory
try {
  await client.uploadDir(localBuildPath, projDirectory);
  console.log("build.zip uploaded successfully");
  console.log(
    "-------------------------------------------WARN-------------------------------------------------"
  );
  console.warn(
    "Don't forget to re-run the docker-compose command to start the containers"
  );
  console.log(
    "-------------------------------------------WARN-------------------------------------------------"
  );
} catch (error) {
  console.error("Error uploading build.zip:", error);
} finally {
  console.log("SFTP connection closed.");
  client.end();
}
