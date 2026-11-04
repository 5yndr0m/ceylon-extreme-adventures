const docs = await sanity.fetch(
  `*[_type=="experience" && defined(category) && !defined(categories)]{_id, category}`
)
for (const d of docs) {
  await sanity.patch(d._id).set({categories: [d.category]}).commit()
}
