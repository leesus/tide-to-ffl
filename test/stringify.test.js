const chai = require('chai');
const stringify = require('../lib/modules/stringify');
const {expect} = chai;

describe('#stringify', () => {
  const rows = [
    ['25/12/2017', -25.99, 'Christmas'],
    ['25/12/2017', 10, 'Christmas Morning'],
    ['31/10/2017', 31.25, 'Halloween'],
  ];

  it('should return a function', () => {
    expect(typeof stringify({})).to.equal('function');
  });

  it('should return rows joined by a newline, with any non-number cells wrapped in quotes', async () => {
    const stringifier = stringify({});
    const {file} = await stringifier(rows);
    expect(file).to.equal(
      '"25/12/2017",-25.99,"Christmas"\n"25/12/2017",10,"Christmas Morning"\n"31/10/2017",31.25,"Halloween"'
    );
  });

  describe('when given a filename', () => {
    it('should return the filename', async () => {
      const stringifier = stringify({filename: 'helloworld.csv'});
      const {filename} = await stringifier(rows);
      expect(filename).to.equal('helloworld.csv');
    });

    it('should return the filename with csv extension', async () => {
      const stringifier = stringify({filename: 'helloworld'});
      const {filename} = await stringifier(rows);
      expect(filename).to.equal('helloworld.csv');
    });
  });

  describe('when not given a filename', () => {
    describe('and there is only 1 row', () => {
      it('should return {date}.csv filename', async () => {
        const stringifier = stringify({});
        const {filename} = await stringifier([rows[0]]);
        expect(filename).to.equal('25122017.csv');
      });
    });

    describe('and there are multiple rows', () => {
      describe('with only one date', () => {
        it('should return {date}.csv filename', async () => {
          const stringifier = stringify({});
          const {filename} = await stringifier([rows[0], rows[1]]);
          expect(filename).to.equal('25122017.csv');
        });
      });

      describe('with multiple dates', () => {
        it('should return {start date}-{end date}.csv', async () => {
          const stringifier = stringify({});
          const {filename} = await stringifier(rows);
          expect(filename).to.equal('31102017-25122017.csv');
        });
      });
    });
  });
});
