import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

export async function getUserUUID(name: string): Promise<string | null> {
  try {
    const response = await notion.users.list({});
    const user = response.results.find(
      (u: any) => u.type === "person" && u.name === name
    );
    return user ? user.id : null;
  } catch (error) {
    console.error("Error fetching user UUID:", error);
    throw error;
  }
}

export async function fetchTaggedUpdates(
  userEmail: string,
  databaseId: string
) {
  try {
    // Query the database for pages where the user is mentioned
    const response = await notion.databases.query({
      database_id: databaseId,
    });


    // Extract relevant data from the results
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates = response.results.map((page: any) => {
      const title = page.properties.Name.title[0]?.text.content || "No Title";
      const lastEdited = page.last_edited_time;
      const categorie = page.properties.Kategorie?.select?.name;
      const color = page.properties.Kategorie?.select?.color;
      return { title, lastEdited, categorie, color };
    });

    return updates;
  } catch (error) {
    console.error("Error fetching tagged updates:", error);
    throw error;
  }
}
