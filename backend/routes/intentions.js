const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const getIntentions = async (req, res, next) => {
  try {
    let data = fs.readFileSync(path.join(__dirname, './files/nlu.md'));
    let dataStr = data.toString();
    dataStr = dataStr.replace(/<!--.*?-->/gs, '');

    const intentions = {};
    const regexNLU = /(##(\sintent:(.+?))\n\n)/gms;
    let m;
    while ((m = regexNLU.exec(dataStr)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regexNLU.lastIndex) {
        regexNLU.lastIndex++;
      }

      let intencion;
      m.forEach((match, groupIndex) => {
        if (groupIndex === 3) {
          const info = match.split('- ');
          intencion = info.shift().trim();
          console.log('intencion: ', intencion);
          intentions[intencion] = {
            ejemplos: info
          };
        }
      });
    }

    data = fs.readFileSync(
      path.join(__dirname, './files/respuestas_bot_alojamiento.csv')
    );
    dataStr = data.toString();
    const regex = /((.+?,)(".+?"))\n?/gs;
    let mr;
    while ((mr = regex.exec(dataStr)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (mr.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      let intencion;
      mr.forEach((match, groupIndex) => {
        if (groupIndex === 2) {
          intencion = match.trim().slice(0, -1);
        }
        if (groupIndex === 3) {
          if (intentions[intencion]) {
            intentions[intencion].respuesta = match.trim().slice(1, -1);
          } else {
            intentions[intencion] = {
              respuesta: match.trim().slice(1, -1)
            };
          }
        }
      });
    }
    res.json(intentions);
  } catch (e) {
    console.log('error:', e);
    next(e);
  }
};
const saveChanges = async (req, res, next) => {};

const info = async (req, res, next) => {
  console.log('/info....');
  const str = [
    'get : info          this service',
    'get : intentions    return files with intentions in JSON format',
    'post: save          save changes in files',
    'post: beginTraining execute training',
    'post: deployProd    deploy to production'
  ];
  res.send(str);
};

const createStats = async (req, res, next) => {
  try {
    const data = fs.readFileSync('statsFilePath');
    const stats = JSON.parse(data);
    const newStats = {
      id: req.body.id,
      wins: req.body.wins,
      losses: req.body.losses,
      points_scored: req.body.points_scored
    };
    stats.push(newStats);
    fs.writeFileSync('statsFilePath', JSON.stringify(stats));
    res.status(201).json(newStats);
  } catch (e) {
    next(e);
  }
};

router.route('/api/getIntentions').get(getIntentions);
router.route('/api/saveChanges').post(saveChanges);
router.route('/api/info').get(info);
router.route('/api/v1/stats').post(createStats);

module.exports = router;
