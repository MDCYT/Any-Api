const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Create a Database for the API Keys
// The API Keys are stored in a MongoDB database
// The database is named "api-keys"
// The collection is named "api-keys"
// The api key need to be unique with uuidv4
// The api key need tier to be either "free", "basic", "pro", or "enterprise"
// The api key need to be associated with a user
// The api key need to be associated with a project
// The api key need timestamp to be the date and time the api key was created
// The api key need timestamp to be the date and time the api key was last used
// The api key need timestamp to be the date and time the api key was last updated
// The api key basic have a limit of 10 requests per minute in /upload endpoint
// The api key pro have a limit of 100 requests per minute in /upload endpoint
// The api key enterprise have a limit of 1000 requests per minute in /upload endpoint
// The api key free dont have access to the /upload endpoint

const ApiKey = new mongoose.model(
  "ApiKeys",
  new mongoose.Schema(
    {
      apiKey: {
        type: String,
        required: true,
        unique: true,
        default: () => {
          return uuidv4();
        },
      },
      tier: {
        type: String,
        required: true,
        enum: ["free", "basic", "pro", "enterprise"],
        default: "free",
      },
      name: {
        type: String,
        required: true,
      },
      project: {
        type: "string",
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      paymentId: {
        type: String,
        required: false,
      },
      timestamp: {
        created: {
          type: Date,
          default: Date.now,
        },
        lastUsed: {
          type: Date,
          default: Date.now,
        },
        lastUpdated: {
          type: Date,
          default: Date.now,
        },
      },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = {
  async createAPIKey({ name, project, tier, email, paymentId }) {
    // Create a new API Key
    //If the user is not found, return an error
    //If the project is not found, return an error
    //If the tier is not found, set the tier to free

    if (!paymentId) {
      if (tier === "free") {
        paymentId = "free";
      } else {
        return {
          error: "Payment ID is required",
        };
      }
    } else {
      const ApiKeys = await this.getByPaymentId(paymentId);
      if (ApiKeys.length > 0) {
        //Check if the all information is correct
        if (
          ApiKeys[0].name === name &&
          ApiKeys[0].project === project &&
          ApiKeys[0].tier === tier &&
          ApiKeys[0].email === email
        ) {
          return ApiKeys[0];
        } else {
          return {
            error: "Payment ID is already in use",
          };
        }
      } else {
        const apiKey = await ApiKey.create({
          name: name,
          project: project,
          tier: tier,
          email: email,
          paymentId: paymentId,
        });

        return apiKey;
      }
    }



  },
  async getAPIKey(apiKey) {
    // Get the API Key
    //If the api key is not found return a array with no api keys
    //If the api key is found, return the api key
    const apiKeyFound = await ApiKey.findOne({
      apiKey: apiKey,
    });

    if (!apiKeyFound) {
      return [];
    }

    return apiKeyFound;
  },

  async getByPaymentId(paymentId) {
    // Get the API Key

    const apiKeyFound = await ApiKey.find({
      paymentId: paymentId,
    });

    if (!apiKeyFound) {
      return [];
    }

    return apiKeyFound;
  },

  async getAPIKeysByProject(project) {
    // Get the API Keys
    //If the project is not found, return a array with no api keys
    //If the project is found, return the api keys
    const apiKeysFound = await ApiKey.find({
      project: project._id,
    });

    if (!apiKeysFound) {
      return [];
    }

    return apiKeysFound;
  },

  async updateAPIKey(apiKey, tier) {
    // Update the API Key
    //If the api key is not found, return an array with no api keys
    //If the api key is found, update the api key
    //If the tier is not found, set the tier to free

    const apiKeyFound = await ApiKey.findOne({
      apiKey: apiKey,
    });

    if (!apiKeyFound) {
      return [];
    }

    apiKeyFound.tier = tier;
    apiKeyFound.timestamp.lastUpdated = Date.now();

    await apiKeyFound.save();

    return apiKeyFound;
  },
  async deleteAPIKey(apiKey) {
    // Delete the API Key
    //If the api key is not found, return an array with no api keys
    //If the api key is found, delete the api key

    const apiKeyFound = await ApiKey.findOne({
      apiKey: apiKey,
    });

    if (!apiKeyFound) {
      return [];
    }

    await apiKeyFound.remove();

    return apiKeyFound;
  },

  getTierByAPIKey(apiKey) {
    // Get the Tier by API Key
    //If the api key is not found return an array with no api keys
    //If the api key is found, return the tier
    const apiKeyFound = ApiKey.findOne({
      apiKey: apiKey,
    });

    if (!apiKeyFound) {
      return [];
    }

    // If the tier is not found, set the tier to free
    if (!apiKeyFound.tier) {
      return "free";
    }

    return apiKeyFound.tier;
  },

  async checkTier(apiKey) {
    if (!apiKey) {
      return 0;
    }

    const apiKeyFound = await ApiKey.findOne({
      apiKey: apiKey,
    });

    if (!apiKeyFound) {
      return 0;
    }

    const tier = apiKeyFound.tier;

    if (tier === "free") {
      return 0;
    }

    if (tier === "basic") {
      return 1;
    }

    if (tier === "pro") {
      return 2;
    }

    if (tier === "enterprise") {
      return 3;
    }

    return 0;

    // If the tier is not found, set the tier to free
  },
};
