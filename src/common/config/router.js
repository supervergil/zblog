module.exports = [
  [/^tag\/(.+)\/?$/i, "tags/detail?tag=:1"],
  [/^cate\/(.+)\/?$/i, "cate/detail?cate=:1"],
  [/^post\/([^/]+)\.html$/i, "post/detail?post=:1"],
  [/^page\/([^/]+)\.html$/i, "page/detail?page=:1"]
];
