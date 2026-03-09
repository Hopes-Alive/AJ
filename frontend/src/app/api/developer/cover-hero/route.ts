import { readFile } from "node:fs/promises";

export const runtime = "nodejs";

const DEFAULT_HERO_IMAGE_PATH =
  "C:/Users/mahas/.cursor/projects/d-start-up-GIMI-AI-AJ/assets/c__Users_mahas_AppData_Roaming_Cursor_User_workspaceStorage_b33765bba37cfa7a18499d82e7ffd1ac_images_ChatGPT_Image_Mar_9__2026__02_15_10_PM-475ba252-65ff-497c-a94d-dc4676838853.png";

export async function GET() {
  const imagePath =
    process.env.PDF_COVER_HERO_IMAGE_PATH?.trim() || DEFAULT_HERO_IMAGE_PATH;

  try {
    const image = await readFile(imagePath);
    return new Response(image, {
      headers: {
        "content-type": "image/png",
        "cache-control": "no-store",
      },
    });
  } catch {
    return new Response("Cover hero image not found", { status: 404 });
  }
}
