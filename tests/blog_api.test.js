const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const api = supertest(app);

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let object = new Blog(blogs[0]);
  await object.save();
  object = new Blog(blogs[1]);
  await object.save();
})


test('all blogs are returned', async () => {
    const res = await api.get('/api/blogs');

    expect(res.body).toHaveLength(blogs.length);
  })

test('blog posts are returned in json', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(2);
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5 
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const res = await api.get('/api/blogs');
  const content = res.body.map(r => r.title);
  expect(res.body).toHaveLength(blogs.length+1);
  expect(content).toContain(
    "React patterns", "Go To Statement Considered Harmful", "Go To Statement Considered Harmful"
  )
}, 1000000);

test('unique property identifier of the blogs is id', async () => {
  const results = await api.get('/api/blogs');
  console.log(results.body);
  results.body.forEach(blog => {
    expect(blog.id).toBeDefined();
  })

})

test('if likes is undefined, the likes is set to 0', async () => {
  const newBlog = {
    title: "I like coding",
    author: "shannon",
    url: "http://google.co.uk"
  }

  const results = await api.post('/api/blogs').send(newBlog);

  const allBlogs = await api.get('/api/blogs');
  const lastBlog = allBlogs.body.find(blog => blog.author === "shannon");

  expect(lastBlog.likes).toEqual(0);
})

test('if title is missing, 404 Bad Request received', async () => {
  const newBlog = {
    author: "shannon honan",
    url: "google.co.uk"
  }

  await api.post('/api/blogs')
          .send(newBlog)
          .expect(400)
})

  afterAll(async () => {
    await mongoose.connection.close()
  })