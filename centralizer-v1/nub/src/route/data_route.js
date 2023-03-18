
import {logger} from "../logger/winson";
import Data from "../classes/data_class";

export const getDataListByApp = {
    path: '/api/data/:appSlug/:dataType',
    method: 'get',
    handler: async (req, res) => {
        const {appSlug, dataType} = req.params;
        try {
            const data = new Data();
            data.appSlug =appSlug;
            const retrievedValue = await  data.retrieveData(parseInt(dataType));
            logger.info(`handle get contents list by app request`, {req, res, info: `contents found successfully!!`});
            return res.status(200).json(retrievedValue);
        } catch (err) {
            logger.error(`handle get contents list by app request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }
    }
}