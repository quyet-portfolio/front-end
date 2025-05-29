import config from "@payload-config";
import { getPayload, type CollectionConfig } from "payload";

const Categories: CollectionConfig = {
	slug: "categories",
	admin: {
		useAsTitle: "name",
	},
	labels: {
		singular: "Category",
		plural: "Categories",
	},
	fields: [
		{
			name: "name",
			label: "Name",
			type: "text",
			required: true,
		},
		{
			name: "title",
			type: "text",
			label: "Meta Title",
		},
		{
			name: "parent",
			label: "Parent Category",
			type: "relationship",
			relationTo: "categories",
			admin: {
				description: "Select a parent category, if applicable.",
			},
		},
		{
			name: "url",
			type: "text",
			required: true,
			label: "url",
			unique: true,
			admin: {
				description: "URL-friendly identifier for the category.",
			},
		},
		{
			name: "keywords",
			label: "Keywords",
			type: "text",
			hasMany: true,
		},
		{
			name: "description",
			type: "textarea",
			label: "Meta Description",
		},
	],
	hooks: {
		beforeChange: [
			async ({ data, operation }) => {
				if (operation === "create" || operation === "update") {
					if (data.parent) {
						const payload = await getPayload({ config });
						const parentCategory = await payload.findByID({
							collection: "categories",
							id: data.parent,
						});

						if (parentCategory?.url) {
							data.url = `${parentCategory.url}${data.url.startsWith("/") ? "" : "/"}${data.url || data.name.toLowerCase().replace(/\s+/g, "-")}`;
						}
					} else {
						data.url = data.url || data.name.toLowerCase().replace(/\s+/g, "-");
					}
				}
				return data;
			},
		],
	},
};

export default Categories;
