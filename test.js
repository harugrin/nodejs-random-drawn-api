const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./index'); // Assuming your server file is named index.js
const { expect } = chai;

chai.use(chaiHttp);

describe('Random Number API', () => {
    it('should get a unique random number', (done) => {
        chai.request(app)
            .get('/uniqueRandom?max=10')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('randomNumber').that.is.a('number');
                done();
            });
    });

    it('should return an error for invalid max parameter', (done) => {
        chai.request(app)
            .get('/uniqueRandom?max=invalid')
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error').that.equals('Invalid max parameter');
                done();
            });
    });

    it('should get all drawn numbers', (done) => {
        chai.request(app)
            .get('/getDrawnNumbers')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('drawnNumbers').that.is.an('array');
                done();
            });
    });

    it('should randomly choose a number from a provided array', (done) => {
        chai.request(app)
            .put('/chooseFromArray')
            .send({ entries: [1, 2, 3, 4, 5] })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('randomValue').that.is.oneOf([1, 2, 3, 4, 5]);
                done();
            });
    });

    it('should return an error for invalid array parameter', (done) => {
        chai.request(app)
            .put('/chooseFromArray')
            .send({ entries: 'invalid' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error').that.equals('Invalid array parameter');
                done();
            });
    });
});