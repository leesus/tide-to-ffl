const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const fs = require('fs');
const {readFileAsync, writeFileAsync} = require('../lib/modules');
const {expect} = chai;

chai.use(sinonChai);

describe('#readFileAsync', () => {
  beforeEach(() => {
    sinon.stub(fs, 'readFileAsync').returns(Promise.resolve('output'));
  });

  afterEach(() => {
    fs.readFileAsync.restore();
  });

  it('should take a file path and call promisified fs#readFile', async () => {
    const file = '/my/file.ext';
    const encoding = 'utf8';
    const output = await readFileAsync(file);

    expect(fs.readFileAsync).to.have.been.calledWith(file, encoding);
    expect(output).to.equal('output');
  });
});

describe('#writeFileAsync', () => {
  beforeEach(() => {
    sinon.stub(fs, 'writeFileAsync').returns(Promise.resolve('output'));
  });

  afterEach(() => {
    fs.writeFileAsync.restore();
  });

  it('should take file contents and a file path and call promisified fs#writeFile', async () => {
    const file = 'output';
    const filename = 'file.ext';
    const output = await writeFileAsync({file, filename});

    expect(fs.writeFileAsync).to.have.been.calledWith(filename, file);
    expect(output).to.eql({file, filename});
  });
});
