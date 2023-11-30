const { expect } = require('chai');
const request = require('supertest');
const app = require('../index.js');

describe('Api connection tests', function() {
    it('Getting a movie by id as a test to show api connection works', async function() {
        const id = 100;
        try {
            const res = await request(app)
              .get('/api/movieId/'+ id)
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('title');

        } catch (error) {
            console.error(error);
            throw error; 
        }
    });
    it('Getting a movie by id that doest exist. Returns an error.', async function() {
        const id = 1;
        const res = await request(app)
            .get('/api/movieId/'+ id)
            .expect(404);
    });

    it('Trying to get page full of top rated movies', async function() {
        const page = 1;
        try {
            const res = await request(app)
              .get('/api/topRatedMovies/' + page)
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('results');
        } catch (error) {
            console.error(error);
            throw error; 
        }
    });
    it('Getting top rated movie list with a page above the allowed 500', async function() {
        const page = 501;
        const res = await request(app)
            .get('/api/topRatedMovies/'+ page)
            .expect(404);
    });
    it('Getting top rated movie list with an invalid page', async function() {
        const page = "hoi";
        try {
            const res = await request(app)
              .get('/api/topRatedShows/' + page)
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('results');
        } catch (error) {
            console.error(error);
            throw error; 
        }
    });

    it('Trying to search movie list with query', async function() {
        const page = 1;
        const query = "five"
        try {
            const res = await request(app)
              .get('/api/searchMovie/' + query + '/' + page  )
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('results');
        } catch (error) {
            console.error(error);
            throw error; 
        }    
    });
    it('Trying to search movie list with query with page not being an int', async function() {
        const query = "five"
        try {
            const res = await request(app)
              .get('/api/searchMovie/' + query + '/s' )
              .expect(200);
      
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('results');
          } catch (error) {
            console.error(error);
            throw error; 
        }
    });
    it('Trying to search movie list with genres and other criteria', async function() {
        const adult = false;
        const page = 1;
        const sort = "popularity.desc";
        const genres = "27,13";
        const negGenres = "11";
        try {
            const res = await request(app)
              .get('/api/advancedMovie/'+adult+'/'+page+'/'+sort+'/'+genres+'/'+negGenres)
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('results');
        } catch (error) {
            console.error(error);
            throw error; 
        }
    });
    it('Trying to search movie list with genres and other criteria while having invalid sort and page. The api defaults sort and route defaults page so it should return 200', async function() {
        const adult = false;
        const page = "Hoi";
        const sort = "invalid sort";
        //It is important to remember that TV shows have a different set of genres.
        const genres = "10759,16";
        const negGenres = "37";
        try {
            const res = await request(app)
              .get('/api/advancedMovie/'+adult+'/'+page+'/'+sort+'/'+genres+'/'+negGenres)
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('results');
        } catch (error) {
            console.error(error);
            throw error; 
        }
    });



    it('Getting a series by id as a test', async function() {
        const id = 100;
        try {
            const res = await request(app)
              .get('/api/tvShowId/'+ id)
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('name');

        } catch (error) {
            console.error(error);
            throw error; 
        }
    });
    it('Getting a series by id that doest exist. Returns an error.', async function() {
        const id = 10909090909090909090;
        const res = await request(app)
            .get('/api/tvShowId/'+ id)
            .expect(404);
    });

    it('Trying to get page full of top rated series', async function() {
        const page = 1;
        try {
            const res = await request(app)
              .get('/api/topRatedShows/' + page)
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('results');
        } catch (error) {
            console.error(error);
            throw error; 
        }
    });
    it('Getting top rated series list with a page above the allowed 500', async function() {
        const page = 501;
        const res = await request(app)
            .get('/api/topRatedShows/'+ page)
            .expect(404);
    });
    it('Getting top rated series list with an invalid page', async function() {
        const page = "hoi";
        try {
            const res = await request(app)
              .get('/api/topRatedShows/' + page)
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('results');
        } catch (error) {
            console.error(error);
            throw error; 
        }
    });

    it('Trying to search series list with query', async function() {
        const page = 1;
        const query = "five"
        try {
            const res = await request(app)
              .get('/api/searchShow/' + query + '/' + page  )
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('results');
        } catch (error) {
            console.error(error);
            throw error; 
        }
    });
    it('Trying to search series list with query with page not being an int. Should return 200.', async function() {
        const query = "five"
        try {
            const res = await request(app)
              .get('/api/searchShow/' + query + '/s' )
              .expect(200);
      
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('results');
          } catch (error) {
            console.error(error);
            throw error; 
        }
    });

    it('Trying to search series list with genres and other criteria', async function() {
        const adult = false;
        const page = 1;
        const sort = "popularity.desc";
        //It is important to remember that TV shows have a different set of genres.
        const genres = "10759,16";
        const negGenres = "37";
        try {
            const res = await request(app)
              .get('/api/advancedSeries/'+adult+'/'+page+'/'+sort+'/'+genres+'/'+negGenres)
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('results');
        } catch (error) {
            console.error(error);
            throw error; 
        }
    });
    it('Trying to search series list with genres and other criteria while having invalid sort and page. The api defaults sort and route defaults page so it should return 200', async function() {
        const adult = false;
        const page = "Hoi";
        const sort = "invalid sort";
        //It is important to remember that TV shows have a different set of genres.
        const genres = "10759,16";
        const negGenres = "37";
        try {
            const res = await request(app)
              .get('/api/advancedSeries/'+adult+'/'+page+'/'+sort+'/'+genres+'/'+negGenres)
              .expect(200);
      
            // Checks that these exist in the returned data.
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('results');
        } catch (error) {
            console.error(error);
            throw error; 
        }
    });

});