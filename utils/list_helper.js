const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum +blog.likes, 0);
}

const favouriteBlog = (blogs) => {
    const mostLikes = blogs.reduce((maxLikes, current) => {
        return current.likes > maxLikes.likes ? current: maxLikes;
    }, blogs[0]);

    return mostLikes;
}

const mostBlogs = (blogs) => {
    const authorBlogCount = blogs.reduce((acc, blog) => {
        const author = blog.author;
        acc[author] = (acc[author] || 0) + 1;
        return acc;
      }, {});
    
      let maxAuthor = null;
      let maxBlogs = 0;
    
      for (const author in authorBlogCount) {
        if (authorBlogCount[author] > maxBlogs) {
          maxBlogs = authorBlogCount[author];
          maxAuthor = author;
        }
    }

    return {
        author: maxAuthor,
        blogs: maxBlogs
    }
}

const mostLikes = (blogs) => {
    const likes = blogs.reduce((acc, blog) => {
        const author = blog.author;
        acc[author] = (acc[author] || 0) + blog.likes;
        return acc;
    }, {});

    let maxAuthor = null;
    let maxLikes = 0;

    for(const author in likes) {
        if(likes[author] > maxLikes) {
            maxLikes = likes[author];
            maxAuthor = author;
        }
    }

    return {
        author: maxAuthor,
        likes: maxLikes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}