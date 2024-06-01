const predictClassification = require('../services/inferenceService');
const { storeData, predictionsCollection } = require('../services/storeData');
const crypto = require('crypto');
const InputError = require('../exceptions/InputError');
const { data } = require('@tensorflow/tfjs-node');

async function postPredict(req, res, next) {
  try {
    const { file: image } = req;
    const { model } = req.app.locals;

    if (!image) {
      throw new InputError('No image provided');
    }

    const { resultScore, result, suggestion } = await predictClassification(model, image.buffer);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      result,
      suggestion,
      createdAt,
    };

    await storeData(id, data);
    res.status(201).json({
      status: 'success',
      message: resultScore > 99 
        ? 'Model is predicted successfully' 
        : 'Model is predicted successfully but under threshold. Please use the correct picture',
      data,
    });
  } catch (error) {
    if (error instanceof InputError) {
      res.status(400).json({ status: 'fail', message: error.message });
    } else {
      next(error);
    }
  }
}

async function getPredictHistories(req, res, next) {
  try {
    const histories = (await predictionsCollection.get()).docs.map(doc => doc.data());
    const data = histories.map(item => ({
      id: item.id,
      history: item,
    }));
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
}

// Discussion handler
const discussions = [];

async function createDiscussion(req, res, next) {
  const { title, content, creator } = req.body;

  const id = crypto.randomUUID();

  if (!title || !content || !creator) {
    return res.status(400).json({ status: 'fail', message: 'Field title, content, createdAt, and creator are required' });
  }

  const createdAt = new Date().toISOString();

  const newDiscussion = {
    id,
    title,
    content,
    createdAt,
    creator,
    comments: [],
  };
  discussions.push(newDiscussion);

  console.log(newDiscussion);

  res.status(201).json({ status: 'success', message: 'Discussion created', data: newDiscussion});
};


async function getAllDiscussions(req, res, next) {
  res.status(200).json({ status: 'success', message: 'Get all discussions', data: discussions });
}

async function getDiscussion(req, res, next) {
  const { id } = req.params;

  const discussion = discussions.find(discussion => discussion.id === id);

  if (!discussion) {
    return res.status(404).json({ status: 'fail', message: 'Discussion not found' });
  }

  res.status(200).json({ status: 'success', message: 'Get a discussion', data: discussion });

}

// comments

async function createComment(req, res, next) {
  const { id } = req.params;
  const { content, creator } = req.body;
  const createdAt = new Date().toISOString();

  const discussion = discussions.find(discussion => discussion.id === id);

  if (!discussion) {
    return res.status(404).json({ status: 'fail', message: 'Discussion not found' });
  }

  if (!content || !creator) {
    return res.status(400).json({ status: 'fail', message: 'Field content and creator are required' });
  }

  const newComment = {
    content,
    createdAt,
    creator,
  };

  discussion.comments.push(newComment);

  res.status(201).json({ status: 'success', message: 'Comment created', data: newComment });
}

async function getComments(req, res, next) {
  const { id } = req.params;

  const discussion = discussions.find(discussion => discussion.id === id);

  if (!discussion) {
    return res.status(404).json({ status: 'fail', message: 'Discussion not found' });
  }

  res.status(200).json({ status: 'success', message: 'Get all comments', data: discussion.comments });
}

// educations
const educations = [];

async function createEducation(req, res, next) {
  const { title, content} = req.body;

  const { file: video } = req;

  const id = crypto.randomUUID();

  if (!title || !content || !video) {
    return res.status(400).json({ status: 'fail', message: 'Field title, content, and video are required' });
  }

  const createdAt = new Date().toISOString();

  const newEducation = {
    id,
    title,
    content,
    video,
    createdAt,
  };
  educations.push(newEducation);

  console.log(newEducation);

  res.status(201).json({ status: 'success', message: 'Education created', data: newEducation});

}

async function getEducations(req, res, next) {
  res.status(200).json({status: 'success', message: "Get all educations", data: educations})
}


module.exports = { postPredict, getPredictHistories, createDiscussion, getAllDiscussions, getDiscussion, createComment, getComments, createEducation, getEducations};

