const mongoose = require("mongoose");

const PhishingDomain = new mongoose.model(
  "PhishingDomains",
  new mongoose.Schema(
    {
      domain: {
        type: String,
        required: true,
        unique: true,
      }
    }
  )
);

module.exports = {
  async createPhishingDomain({ domain }) {
    const phishingDomain = await PhishingDomain.create({
      domain,
    });
    phishingDomain.save();
  },

  async getPhishingDomain({ domain }) {
    const phishingDomain = await PhishingDomain.findOne({
      domain,
    });
    return phishingDomain || undefined;
  }
};