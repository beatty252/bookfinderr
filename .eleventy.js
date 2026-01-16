module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("netlify");
  
  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
