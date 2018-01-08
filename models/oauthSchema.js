const uuidv1 = require('uuid/v1');
var Schema=mongoose.Schema;
var ClientSchema = new Schema({
	name: { type: String, required: true },
	client_id: { type: String, unique: true},
	client_secret: { type: String, unique: true},
	domains: [ { type: String } ]
});
var GrantCodeSchema = new Schema({
	code: { type: String, unique: true, default: function() {
			return uuidv1();
		}
	},
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	client: { type: Schema.Types.ObjectId, ref: 'Client' },
	scope: [ { type: String } ],
	active: { type: Boolean, default: true }
});
var TokenSchema = new Schema({
	token: { type: String, unique: true, default: function() {
            return uuidv1();
		}
	},
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	client: { type: Schema.Types.ObjectId, ref: 'Client' },
	scope: [ { type: String }],
	expires: { type: Date, default: function(){
		console.log( new Date());
		return new Date(new Date().getTime()+60*60000);
	} }
});


var UserSchema=new Schema({
	name: { type: String, required: true },
	username: { type: String, unique: true},
	password:  { type: String }
});

exports.Client = mongoose.model('Client', ClientSchema);
exports.User = mongoose.model('User', UserSchema);
exports.GrantCode = mongoose.model('GrantCode', GrantCodeSchema);
exports.Token = mongoose.model('Tokens', TokenSchema);