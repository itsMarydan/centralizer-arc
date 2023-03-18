import Settings from "../classes/settings_class";

export const createSettings = {
    path: '/api/create-settings',
    method: 'post',
    handler: async (req, res) => {
        const { settingsType, settingsConfig} = req.body;
        const settings  = new Settings(settingsType, settingsConfig);
        try{
          const saved =  await settings.createSettings ();
          if(saved) {
              return res.status(200).json({msg: "saved!"})
          }else{
              return res.status(500).json([{msg: 'not saved!'}])
          }
        }catch (e){
            return res.status(500).json([{msg: 'not saved!', err: e.toString()}])
        }
    }

}


export const updateSettings = {
    path: '/api/update-settings/:settingsId',
    method: 'put',
    handler: async (req, res) => {
        const { updates} = req.body;
        const settingsId = req.params.settingsId;
        const settings  = new Settings();
        settings.settingsId = settingsId;

        try{
            const updated =  await settings.updateSettings(updates);
            if(updated) {
                return res.status(200).json({msg: "updated"})
            }else{
                return res.status(500).json([{msg: 'not updated'}])
            }
        }catch (e){
            return res.status(500).json([{msg: 'not updated', err: e.toString()}])
        }
    }

}


export const retrieveSettings = {
    path: '/api/get-settings/:settingsId',
    method: 'get',
    handler: async (req, res) => {
        const settingsId = req.params.settingsId;
        const settings  = new Settings();
        settings.settingsId = settingsId;

        try{
            const value =  await settings.retrieveSettings();
            if(value) {
                return res.status(200).json(value)
            }else{
                return res.status(500).json([{msg: 'not retrieved'}])
            }
        }catch (e){
            return res.status(500).json([{msg: 'not retrieved', err: e.toString()}])
        }
    }

}


export const retrieveSettingsByType = {
    path: '/api/get-settings-by-type/:settingsType',
    method: 'get',
    handler: async (req, res) => {
        const settingsType = req.params.settingsType;
        const settings  = new Settings();
        settings.settingsType = settingsType;
        try{
            const value =  await settings.retrieveSettingsByType();
            if(value) {
                return res.status(200).json(value)
            }else{
                return res.status(500).json([{msg: 'not retrieved'}])
            }
        }catch (e){
            return res.status(500).json([{msg: 'not retrieved', err: e.toString()}])
        }
    }

}


export const retrieveAllSettings = {
    path: '/api/settings',
    method: 'get',
    handler: async (req, res) => {
        const settings  = new Settings();
        try{
            const value =  await settings.retrieveAll();
            if(value) {
                return res.status(200).json(value)
            }else{
                return res.status(500).json([{msg: 'not retrieved'}])
            }
        }catch (e){
            return res.status(500).json([{msg: 'not retrieved', err: e.toString()}])
        }
    }

}


export const deleteSettings = {
    path: '/api/delete-settings/:settingsId',
    method: 'delete',
    handler: async (req, res) => {
        const settingsId = req.params.settingsId;
        const settings  = new Settings();
        settings.settingsId = settingsId;

        try{
            const deleted =  await settings.deleteSettings();
            if(deleted) {
                return res.status(200).json({msg: "deleted!"})
            }else{
                return res.status(500).json([{msg: 'not deleted'}])
            }
        }catch (e){
            return res.status(500).json([{msg: 'not deleted', err: e.toString()}])
        }
    }

}