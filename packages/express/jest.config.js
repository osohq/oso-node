const sharedConfig = require('../../jest.config.js');

module.exports = {
    ...sharedConfig,
    modulePathIgnorePatterns: ['<rootDir>/build/'],
}
