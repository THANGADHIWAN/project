import { Octokit } from "@octokit/rest";
import multiparty from "multiparty";
import fs from "fs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const form = new multiparty.Form();
  const data = await new Promise((resolve, reject) => {
    form.parse(event, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ files });
    });
  });

  const file = data.files.file[0];
  const content = fs.readFileSync(file.path, "utf8");

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  await octokit.repos.createOrUpdateFileContents({
    owner: "YOUR_GITHUB_USERNAME",
    repo: "YOUR_REPO_NAME",
    path: `content/${file.originalFilename}`,
    message: `Add article: ${file.originalFilename}`,
    content: Buffer.from(content).toString("base64"),
    branch: "main",
  });

  return { statusCode: 200, body: "File uploaded successfully" };
}
