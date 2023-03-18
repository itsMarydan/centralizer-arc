import Role from "../classes/role_class";
import {logger} from "../logger/winson";
import Option from "../classes/option_class"

export const createOption = {
    path: '/api/create-option',
    method: 'post',
    handler: async (req, res) => {
        const {userId, optionType, optionConfig} = req.body;
        const anOption = new Option();
        anOption.userId = userId;
        anOption.optionType = optionType;
        anOption.optionConfig= optionConfig;
        const isDuplicate = await anOption.checkIfExists();
        if (isDuplicate) return res.status(500).json({
            error: "Duplicate Option",
            message: `This Option already exist for  user ${userId}`
        });
        try {

            await anOption.create();
            logger.info('handle method save new option', {info: `new option was created successfully!!`})
        } catch (err) {
            logger.error('handle request create new option', {req, res, error: err});
        }
        logger.info('handle request create new option', {req, res, info: "Success!"});
        return res.status(200).json({message: "Success!"})
    }

};
export const getOption = {
    path: '/api/option/:optionType/:userId',
    method: 'get',
    handler: async (req, res) => {
        const anOption = new Option();
        try {
            const option = await anOption.retrieve({optionType: req.params.optionType, userId: req.params.userId});
            if(option){
                logger.info(`handle get option request`, {req, res, info: `option was found successfully!!`});
                return res.status(200).json(option);
            }else{
                return res.status(404).json({
                        error: "Not found",
                        message: "Option does not exist or has been marked deleted"
                    }
                )
            }

        } catch (err) {
            logger.error(`handle get option request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }

    }
}
export const getUserOption = {
    path: '/api/option/:userId',
    method: 'get',
    handler: async (req, res) => {
        const anOption = new Option();
        try {
            const option = await anOption.retrieveMany({ userId: req.params.userId});
            if(option){
                logger.info(`handle get option request`, {req, res, info: `option was found successfully!!`});
                return res.status(200).json(option);
            }else{
                return res.status(404).json({
                        error: "Not found",
                        message: "Option does not exist or has been marked deleted"
                    }
                )
            }
        } catch (err) {
            logger.error(`handle get option request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }

    }
}
export const validateOption = {
    path: '/api/validate-option/:optionType/:userId',
    method: 'get',
    handler: async (req, res) => {
        const anOption = new Option();
        anOption.userId = req.params.userId;
        anOption.optionType = req.params.optionType;
        try{
            const validate = await anOption.checkIfExists()
            return res.status(200).json(validate);
        }catch (err) {
            logger.error(`handle validate option request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }
    }
}
export const updateOption = {
    path: '/api/update-option/:optionType/:userId',
    method: 'put',
    handler: async (req, res) => {
        const anOption = new Option();
        const updates = req.body;
        try {
            const option = await anOption.update({optionType: req.params.optionType, userId: req.params.userId}, updates);
            if(option){
                logger.info(`handle update option request`, {req, res, info: `option was updated successfully!!`});
                return res.status(200).json(true);
            }else{
                return res.status(404).json({
                        error: "Not found",
                        message: "Option does not exist or has been marked deleted"
                    }
                )
            }

        } catch (err) {
            logger.error(`handle update option request`, {req, res, error: err});
            return res.status(500).json({message: `An error Occurred!: \r\n ${err}`})
        }

    }
}

