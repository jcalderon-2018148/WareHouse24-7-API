'use strict'
const Branch = require('./branch.model');
const fs = require('fs')
const path = require('path')

exports.test = (req, res) => {
    res.send({ message: `Hi branches` });
}

/* ----- ADD BRANCH ----- */
exports.addBranch =async(req, res)=>{
    try {
        let data = req.body;
        let branch = new Branch(data);
        await branch.save();
        return res.send({message: 'Branch added successfully', branch: branch})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error adding branches'})
    }
}


/* ----- GET BRANCHES ----- */
exports.getBranches = async(req, res)=>{
    try {
        let branches = await Branch.find();
        return res.send({'branches': branches});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error getting branches'})
    }
}

/* ----- GET BRANCH ----- */
exports.getBranch = async(req, res)=>{
    try {
        let branchId = req.params.id;
        let branch = await Branch.findOne({_id: branchId})
        if(!branch) return res.status(404).send({message: 'Couldnt found the branch'})
        return res.send({message: 'Branch found', branch: branch});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error getting this branch'})
    }
}

/* ----- UPDATE BRANCH ----- */
exports.updatedBranch = async(req, res)=>{
    try {
        let data = req.body;
        let branchId = req.params.id;
        let updateBranch = await Branch.findOneAndUpdate(
            {_id: branchId},
            data,
            {new: true}
        )
        if(!updateBranch) return res.status(404).send({message: 'Couldnt find and update the branch'})
        return res.send({message: 'Branch updated: ',updateBranch})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error updating branch'})
    }
}

/* ----- ISABLED BRANCH ----- */
exports.disabledBranch = async(req, res)=>{
    try {
        let branchId = req.params.id;
        let disabledBranch = await Branch.findOneAndUpdate(
            {_id: branchId},
            {state: 'DISABLE'},
            {new: true}
        )
        if(!disabledBranch) return res.status(500).send({message: 'Couldnt find and disable the branch'})
        return res.send({message: 'Branch disabled successfully'})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error disabling branch'})
    }
}

exports.deleteBranch = async(req, res)=>{
    try {
        let branchId = req.params.id;
        let deleteBranch = await Branch.findOneAndDelete({_id: branchId});
        if(!deleteBranch) return res.status(404).send({message: 'Couldnt found and delete branch'});
        return res.send({message: 'Branch deleting successfully'})
    } catch (err) {
       console.error(err);
       return res.status(500).send({message: 'Error deleting branch'}) 
    }
}



/* ----- ADD PHOTOS ----- */
exports.uploadImg = async(req, res) => {
    try {
        const branchId = req.params.id
        const alreadyImage = await Branch.findOne({_id: branchId})
        let pathFile = './src/uploads/branches/'

        if(alreadyImage.photo) fs.unlinkSync(`${pathFile}${alreadyImage.photo}`)
        if(!req.files.image || !req.files.image.type) return res.status(400).send({message: 'Have not sent an image'}) 

        const filePath = req.files.image.path
        
        const fileSplit = filePath.split('\\')
        const fileName = fileSplit[3]

        const extension = fileName.split('\.')
        const fileExt = extension[1]

        if(
            fileExt == 'png' ||
            fileExt == 'jpg' ||
            fileExt == 'jpeg'
        ){
            const updatedBranch = await Branch.findOneAndUpdate(
                {_id: branchId},
                {photo: fileName},
                {new: true}
            )
            if(!updatedBranch) return res.status(404).send({message: 'Branch not found and not updated'})
            return res.send({message: 'Branch updated', updatedBranch})
        }

        fs.unlinkSync(filePath)
        return res.status(400).send({message: 'File extension not admited'})

    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error uploading image', error: err})
    }
}

/* ----- GET PHOTO ----- */
exports.getImg = async(req, res) => {
    try {
        const fileName = req.params.file
        const pathFile = `./src/uploads/branches/${fileName}`
        const image = fs.existsSync(pathFile)
        
        if(!image) return res.status(404).send({message: 'Image not found ;('})
        
        return res.sendFile(path.resolve(pathFile))

    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting image', error: err})
    }
}
