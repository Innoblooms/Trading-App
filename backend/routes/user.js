const router = require('express').Router();
const _user = require('../controller/user');
const _auth = require('../middlewares/auth');

//user routes
router.post('/register', _user.uploadFiles, _user.create);
router.post('/signIn', _user.login);
router.get('/allUser', _auth.verifyTokn, _user.findAll);
router.get("/:id", _user.findOne);
router.put("/update/:id",  _user.uploadFiles ,_user.update);
router.delete("/delete/:id", _user.delete);
router.delete("/delete",  _auth.verifyTokn ,_user.deleteAll)

module.exports = router;