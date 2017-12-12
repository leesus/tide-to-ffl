const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const lib = require('../lib/modules');
const convert = require('../lib');
const {expect} = chai;

chai.use(sinonChai);

describe('#convert', () => {
  beforeEach(() => {
    sinon.stub(lib, 'readFileAsync').resolves(Promise.resolve('file'));
    sinon.stub(lib, 'transform').returns(() => Promise.resolve('file'));
    sinon.stub(lib, 'stringify').returns(() => Promise.resolve('file'));
    sinon.stub(lib, 'writeFileAsync').resolves(Promise.resolve('output'));
  });

  afterEach(() => {
    lib.readFileAsync.restore();
    lib.transform.restore();
    lib.stringify.restore();
    lib.writeFileAsync.restore();
  });

  it('should call #readFileAsync, #transform, #stringify and #writeFileAsync', async () => {
    const options = {a: 1, b: 2, c: 3};
    const output = await convert(options);
    expect(lib.readFileAsync).to.have.been.called;
    expect(lib.transform).to.have.been.called;
    expect(lib.stringify).to.have.been.called;
    expect(lib.writeFileAsync).to.have.been.called;
    expect(output).to.equal('output');
  });
});
