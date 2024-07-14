"use strict";

const WareHouse = require("./warehouse.model");
const User = require("../user/user.model");
const Branch = require("../branch/branch.model");
const Service = require("../service/service.model");
const { validateData } = require("../utils/validate");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

/* ----- ADD ----- */
exports.add = async (req, res) => {
  try {
    let data = req.body;
    let total = 0,t=0;
    data.size.area = Number(data.size.depth * data.size.length).toFixed(2);
    let { capitalGain } = await Branch.findOne({ _id: data.branch });
    capitalGain = Number(capitalGain / 100).toFixed(2);
    console.log(data.price);
    let subtotal = Number(
      Number(data.price) + Number(data.price) * capitalGain
    ).toFixed(2);
    console.log(data.price);
    data.price = subtotal;
    console.log(data.price);
    for (let service of data.services) {
      let { price } = await Service.findOne({ _id: service.service });
      total = Number(total + price).toFixed(2);
    }
    t = Number(data.price) + Number(total);
    data.price = Number(t).toFixed(2);
    let warehouse = new WareHouse(data);
    await warehouse.save();
    return res.send({ message: `The warehouse was added`, warehouse });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: `Error adding warehouse` });
  }
};

/* ----- GETs ----- */
exports.gets = async (req, res) => {
  try {
    let warehouses = await WareHouse.find({}, { "size._id": 0 })
      .populate("services.service")
      .populate({
        path: "lessee",
        select: "names surnames phone",
      })
      .populate("branch")
      .populate("additionalService.service");
    return res.send({ warehouses });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: `Error getting warehouses` });
  }
};

/* ----- GET ----- */
exports.get = async (req, res) => {
  try {
    let idWarehouse = req.params.id;
    let warehouse = await WareHouse.findOne(
      { _id: idWarehouse },
      { "size._id": 0 }
    )
      .populate("services.service")
      .populate({
        path: "lessee",
        select: "names surnames phone",
      })
      .populate("branch");
    return res.send({ warehouse });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: `Error getting warehouse` });
  }
};

/* ----- UPDATE ----- */
exports.upd = async (req, res) => {
  try {
    let idWarehouse = req.params.id;
    let data = req.body;
    data.size.area = Number(data.size.heigth * data.size.length).toFixed(2);
    let updWare = await WareHouse.findOneAndUpdate(
      {
        _id: idWarehouse,
      },
      data,
      {
        new: true,
      }
    );
    if (!updWare)
      return res
        .status(401)
        .send({ message: `Warehouse not found or not updated` });
    return res.send({ message: `The warehouse updated`,updWare });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: `Error updatting warehouse` });
  }
};

/* ----- DELETE ----- */
exports.dele = async (req, res) => {
  try {
    let idWarehouse = req.params.id;
    const ware = await WareHouse.findOne({ _id: idWarehouse }).lean();
    console.log(ware);
    if ("lessee" in ware)
      return res
        .status(401)
        .send({ message: `the warehouse cannot be deleted as it is leased` });
    let deleteWare = await WareHouse.findOneAndDelete({ _id: idWarehouse });
    if (!deleteWare)
      return res
        .status(401)
        .send({ message: `Warehouse not found or not deleted` });
    return res.send({ message: `The warehouse has been removed` });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: `Error deletting warehouse` });
  }
};

/* ----- ASSIGN LESSEE ----- */
exports.assign = async (req, res) => {
  try {
    let idWarehouse = req.params.id;
    let total = 0;
    let data = {
      lessee: req.body.lessee,
      additionalService: req.body.additionalService,
    };
    let msg = validateData(data);
    if (msg) return res.status(418).send(msg);

    for (let service of data.additionalService) {
      let { price } = await Service.findOne({ _id: service.service });
      total = Number(total + price).toFixed(2);
    }

    let updWare = await WareHouse.findOneAndUpdate(
      {
        _id: idWarehouse,
      },
      {
        lessee: data.lessee,
        additionalService: data.additionalService,
        $inc: { price: total },
        state: "LEASED",
      },
      {
        new: true,
      }
    );
    if (!updWare)
      return res
        .status(401)
        .send({ message: `Warehouse not found or not assigning lessee` });
    return res.send({ message: `The client has been assigned`, updWare });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: `Error assigning lessee` });
  }
};

/* ----- DEALLOCATE LESSEE ----- */
exports.deallocate = async (req, res) => {
  try {
    let idWarehouse = req.params.id;
    let { additionalService } = await WareHouse.findOne({
      _id: idWarehouse,
    });
    let total = 0;
    console.log(additionalService);
    for (let service of additionalService) {
      let w = await Service.findOne({ _id: service.service });
      total = Number(total + w.price);
    }
    total = total * -1;
    let updWare = await WareHouse.findOneAndUpdate(
      {
        _id: idWarehouse,
      },
      {
        $unset: { lessee: "", additionalService: "" },
        $inc: { price: Number(total).toFixed(2) },
        state: "ACTIVE",
      },
      {
        new: true,
      }
    );
    if (!updWare)
      return res
        .state(401)
        .send({ message: `Warehouse not found or not assigning lessee` });
    return res.send({
      message: `The customer has been designated to the warehouse`,
      updWare,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: `Error deallocated lessee` });
  }
};

/* ---- UPLOAD IMG ----- */
exports.uploadImg = async (req, res) => {
  try {
    const idWarehouse = req.params.id;
    const existImage = await WareHouse.findOne({ _id: idWarehouse });
    let pathFile = "./src/uploads/warehouses/";

    if (existImage.photo) fs.unlinkSync(`${pathFile}${existImage.photo}`);
    if (!req.files.image || !req.files.image.type)
      return res.status(400).send({ message: `Hace not sent an image` });

    const filePath = req.files.image.path;
    const fileSplit = filePath.split("\\");
    const fileName = fileSplit[3];
    const extension = fileName.split(".");
    const fileExt = extension[1];

    if (fileExt == "png" || fileExt == "jpg" || fileExt == "jpeg") {
      let updWare = await WareHouse.findByIdAndUpdate(
        {
          _id: idWarehouse,
        },
        {
          photo: fileName,
        },
        {
          new: true,
        }
      );
      if (!updWare)
        return res
          .status(404)
          .send({ message: `Warehouse nor found or not updated` });
      return res.send({ message: `Warehpuse updated photo`, updWare });
    }
    fs.unlinkSync(filePath);
    return res.status(400).send({ message: "File extension not admited" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: `Error adding image` });
  }
};

/* ----- GET WAREHOUSE PHOTO ----- */
exports.getImg = async (req, res) => {
  try {
    let fileName = req.params.file;
    const pathFile = `./src/uploads/warehouses/${fileName}`;
    console.log(pathFile);
    let img = fs.existsSync(pathFile);
    if (!img) return res.status(404).send({ message: `Image not found` });
    return res.sendFile(path.resolve(pathFile));
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: `Error getting photo` });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await User.find(
      { role: "CLIENT" },
      { names: 1, surnames: 1, phone: 1 }
    );
    return res.send({ clients });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: `Error getting clients` });
  }
};

exports.test = (req, res) => {
  res.send({ message: `Hi Warehouses` });
};
