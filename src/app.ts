import express from "express";
import { fetchTaggedUpdates, getUserUUID } from "./services/notionService";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

(async () => {
  const databaseId = "d0a02784c22941ecacabadfdd3bd3391";
  const name = "Daniel";

  const uuid = await getUserUUID(name);

  const updates = await fetchTaggedUpdates(uuid, databaseId);


  const itemsWithCategory = updates.filter(item => item.categorie)

  const table = itemsWithCategory.reduce((acc, item) => {
    if (!acc[item.categorie]) {
      acc[item.categorie] = [];
    }
    acc[item.categorie].push(item)
    return acc;
  }, {} as Record<string, typeof itemsWithCategory>) 



  const printBoard = (table) => {
    console.log("Board")
    console.log("=".repeat(30))
    for (const [categorie, cards] of Object.entries(table)) {
      console.log(`Categorie: ${categorie}`)
      console.log("-".repeat(30))
      if (cards.length > 0) {
        cards.forEach((card, index) => {
        console.log(`Title: ${card.title}`)
        console.log(`Last edited: ${card.lastEdited}`)
        console.log('\n')
        })
      }
    }
  }

  printBoard(table)
//  console.log("Updates for tagged user:", table);
})();
