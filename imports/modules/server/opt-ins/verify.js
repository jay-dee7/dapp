import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { VERIFY_CLIENT } from '../../../startup/server/namecoin-configuration.js';
import { nameShow } from '../../../../server/api/namecoin.js';
import getOptInProvider from '../dns/get_opt-in-provider.js';
import getOptInKey from '../dns/get_opt-in-key.js';
import verifySignature from '../namecoin/verify_signature.js';

const VerifyOptInSchema = new SimpleSchema({
  recipient_mail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  sender_mail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  name_id: {
    type: String
  },
  recipient_public_key: {
    type: String
  }
});

const verifyOptIn = (data) => {
  try {
    const ourData = data;
    VerifyOptInSchema.validate(ourData);
    const entry = nameShow(VERIFY_CLIENT, ourData.name_id);
    if(entry === undefined) return false;
    const entryData = JSON.parse(entry.value);
    const firstCheck = verifySignature({
      data: ourData.recipient_mail+ourData.sender_mail,
      signature: entryData.signature,
      publicKey: ourData.recipient_public_key
    })
    if(!firstCheck) return false;
    const parts = ourData.recipient_mail.split("@");
    const domain = parts[parts.length-1];
    const provider = getOptInProvider({domain: domain});
    const publicKey = getOptInKey({domain: provider});
    const secondCheck = verifySignature({
      data: entryData.signature,
      signature: entryData.doiSignature,
      publicKey: publicKey
    })
    if(!secondCheck) return false;
    return true;
  } catch (exception) {
    throw new Meteor.Error('opt-ins.verify.exception', exception);
  }
};

export default verifyOptIn