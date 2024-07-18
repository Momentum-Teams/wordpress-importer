import { Wp2Storyblok } from "./index.js";

console.log("Starting the migration process...");
import dotenv from "dotenv";

dotenv.config();

try {

  // uncomment to check available types
  //
  // fetch(process.env.WP_ENDPOINT/v2/types")
  // .then(response => response.json())
  // .then(postTypes => {
  //   console.log('Available post types:');
  //   Object.entries(postTypes).forEach(([name, details]) => {
  //     console.log(`- ${name}: ${details.name}`);
  //   });
  // })
  // .catch(error => console.error('Error:', error));

  //FIXME: escape characters in the slug for ä ö ü


  //TODO: add more blocks mapping + test
  const wp2storyblok = new Wp2Storyblok(process.env.WP_ENDPOINT, {
    token: process.env.SB_MANAGEMENT_TOKEN,
    space_id: process.env.SB_SPACE_ID,
    blocks_mapping: [
      {
        name: "core/paragraph",
        new_block_name: "richText",
        schema_mapping: {
          "attrs.content": "content.content",
        },
      },
    ],
    content_types: [
      {
        name: "posts",
        new_content_type: "Insight",
        folder: "wp-import-4", //TODO: pick folder name
        // taxonomies: [
        //   {
        //     name: "categories",
        //     field: "categories",
        //     type: "value",
        //   },
        // ],
        schema_mapping: {
          title: "content.title",
          "yoast_head_json.0.og_image.url": "content.previewImage",
          "slug": "name",
          "_links.wp:featuredmedia.0": "content.previewImage",
          content: {
            field: "content.pageContent",
            component: "richText",
            component_field: "content",
            categories: "content.categories",
          },
        },
      },
    ],
  });

  wp2storyblok.migrate();
} catch (error) {
  console.error("An error occurred during the migration process.");

  console.error(error);
}
