const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const lib = require('../lib/modules/transform');
const {expect} = chai;

chai.use(sinonChai);

describe('#transform', () => {
  const rows = [
    [
      'Date',
      'Timestamp',
      'Transaction ID',
      'Transaction description',
      'Category name',
      'Category ID',
      'Amount',
      'Transaction type',
      'To',
      'From',
      'Reference',
      'To Account number',
      'To Sort code',
      'Status',
    ],
    [
      '2017-12-25',
      '2017-12-25 16:35:02',
      'T171225163502',
      'Christmas',
      'Sales',
      '123456',
      '-25.99',
      'Faster Payment in',
      'Blah',
      'Payee 1',
      'Blah',
      'Blah',
      'Blah',
      'Cleared',
    ],
    [
      '2017-11-23',
      '2017-11-23 16:35:02',
      'T171225163502',
      'Thanksgiving',
      'Sales',
      '123456',
      '24.75',
      'Faster Payment in',
      'Blah',
      'Payee 3',
      'Blah',
      'Blah',
      'Blah',
      'Cleared',
    ],
    [
      '2017-10-31',
      '2017-10-31 08:16:10',
      'T171031081610',
      'Halloween',
      'Expenses',
      '654321',
      '31.25',
      'Direct Debit',
      'Payee 2',
      'Blah',
      'Blah',
      'Blah',
      'Blah',
      'Cleared',
    ],
  ];
  const file = rows.join('\n');

  it('should return a function', () => {
    expect(typeof lib.transform({})).to.equal('function');
  });

  it('should call promisified csv#parse', async () => {
    sinon.stub(lib, 'parseAsync').returns(Promise.resolve(rows));
    await lib.transform({})(file);
    expect(lib.parseAsync).to.have.been.calledWith(file, {
      delimiter: ',',
    });
    lib.parseAsync.restore();
  });

  it('should transform the non-header rows as per the field transforms', async () => {
    const transformer = lib.transform({});
    const output = await transformer(file);
    expect(output).to.eql([
      ['25/12/2017', -25.99, 'Christmas'],
      ['23/11/2017', 24.75, 'Thanksgiving'],
      ['31/10/2017', 31.25, 'Halloween'],
    ]);
  });

  describe('when given a start date', () => {
    it('should only include rows after greater than or equal to that date', async () => {
      let transformer = lib.transform({start: '2017-10-31'});
      let output = await transformer(file);
      expect(output).to.eql([
        ['25/12/2017', -25.99, 'Christmas'],
        ['23/11/2017', 24.75, 'Thanksgiving'],
        ['31/10/2017', 31.25, 'Halloween'],
      ]);

      transformer = lib.transform({start: '2017-11-01'});
      output = await transformer(file);
      expect(output).to.eql([
        ['25/12/2017', -25.99, 'Christmas'],
        ['23/11/2017', 24.75, 'Thanksgiving'],
      ]);
    });

    describe('and single option is true', () => {
      it('should only include rows equal to that date', async () => {
        let transformer = lib.transform({start: '2017-10-31'});
        let output = await transformer(file);
        expect(output).to.eql([
          ['25/12/2017', -25.99, 'Christmas'],
          ['23/11/2017', 24.75, 'Thanksgiving'],
          ['31/10/2017', 31.25, 'Halloween'],
        ]);

        transformer = lib.transform({start: '2017-11-23', single: true});
        output = await transformer(file);
        expect(output).to.eql([['23/11/2017', 24.75, 'Thanksgiving']]);
      });
    });
  });

  describe('when given an end date', () => {
    it('should only include rows after less than or equal to that date', async () => {
      let transformer = lib.transform({end: '2017-12-25'});
      let output = await transformer(file);
      expect(output).to.eql([
        ['25/12/2017', -25.99, 'Christmas'],
        ['23/11/2017', 24.75, 'Thanksgiving'],
        ['31/10/2017', 31.25, 'Halloween'],
      ]);

      transformer = lib.transform({end: '2017-12-24'});
      output = await transformer(file);
      expect(output).to.eql([
        ['23/11/2017', 24.75, 'Thanksgiving'],
        ['31/10/2017', 31.25, 'Halloween'],
      ]);
    });

    describe('and single option is true', () => {
      it('should only include rows equal to that date', async () => {
        let transformer = lib.transform({end: '2017-12-25'});
        let output = await transformer(file);
        expect(output).to.eql([
          ['25/12/2017', -25.99, 'Christmas'],
          ['23/11/2017', 24.75, 'Thanksgiving'],
          ['31/10/2017', 31.25, 'Halloween'],
        ]);

        transformer = lib.transform({end: '2017-10-31', single: true});
        output = await transformer(file);
        expect(output).to.eql([['31/10/2017', 31.25, 'Halloween']]);
      });
    });
  });

  describe('when given a start and end date', () => {
    it('should only include rows between or including the dates', async () => {
      let transformer = lib.transform({
        start: '2017-10-31',
        end: '2017-12-25',
      });
      let output = await transformer(file);
      expect(output).to.eql([
        ['25/12/2017', -25.99, 'Christmas'],
        ['23/11/2017', 24.75, 'Thanksgiving'],
        ['31/10/2017', 31.25, 'Halloween'],
      ]);

      transformer = lib.transform({
        start: '2017-11-01',
        end: '2017-12-24',
      });
      output = await transformer(file);
      expect(output).to.eql([['23/11/2017', 24.75, 'Thanksgiving']]);
    });
  });
});
