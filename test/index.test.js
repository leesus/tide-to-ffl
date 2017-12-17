const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const lib = require('../lib/modules');
const convert = require('../lib');
const {expect} = chai;

chai.use(sinonChai);

describe('#convert', () => {
  const buffer = {};
  const file = '/file/path';

  beforeEach(() => {
    sinon.stub(lib, 'readFileAsync').resolves(Promise.resolve(buffer));
    sinon.stub(lib, 'transform').returns(() => Promise.resolve([]));
    sinon
      .stub(lib, 'stringify')
      .returns(() => Promise.resolve({file: 'file', filename: 'file.xyz'}));
    sinon
      .stub(lib, 'writeFileAsync')
      .resolves(Promise.resolve({file: 'file', filename: 'file.xyz'}));
  });

  afterEach(() => {
    lib.readFileAsync.restore();
    lib.transform.restore();
    lib.stringify.restore();
    lib.writeFileAsync.restore();
  });

  it('should call #readFileAsync, #transform, #stringify and #writeFileAsync', async () => {
    const file = 'path/to/file';
    const options = {a: 1, b: 2, c: 3};
    const output = await convert(file, options);
    expect(lib.readFileAsync).to.have.been.called;
    expect(lib.transform).to.have.been.called;
    expect(lib.stringify).to.have.been.called;
    expect(lib.writeFileAsync).to.have.been.called;
    expect(output).to.eql({file: 'file', filename: 'file.xyz'});
  });

  describe('when options.buffer is true', () => {
    it('should not call any file methods and call #transform and #stringify', async () => {
      const buffer = {};
      const options = {buffer: true};
      const output = await convert(buffer, options);
      expect(lib.readFileAsync).not.to.have.been.called;
      expect(lib.transform).to.have.been.called;
      expect(lib.stringify).to.have.been.called;
      expect(lib.writeFileAsync).not.to.have.been.called;
      expect(output).to.eql({file: 'file', filename: 'file.xyz'});
    });
  });
});
