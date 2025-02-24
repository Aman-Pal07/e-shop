import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((oldImages) => [...oldImages, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newForm = new FormData();

    images.forEach((image, index) => {
      newForm.append(`images`, image); // Append images correctly
    });

    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);
    newForm.append("shopId", seller._id);

    dispatch(
      createProduct({
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        shopId: seller._id,
        images,
      })
    );
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="w-[90%] md:w-[60%] lg:w-[35%] xl:w-[30%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-auto custom-scrollbar">
      <h5 className="text-[28px] font-Poppins text-center">Create Product</h5>
      {/* Create Product Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="pb-1 block">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-1 w-full px-3 h-[35px] border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name..."
          />
        </div>

        <div>
          <label className="pb-1 block">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            rows="5"
            name="description"
            value={description}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description..."
          ></textarea>
        </div>

        <div>
          <label className="pb-1 block">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-1 border h-[35px] rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a category</option>
            {categoriesData &&
              categoriesData.map((i) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="pb-1 block">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            className="mt-1 w-full px-3 h-[35px] border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter product tags..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="pb-1 block">Original Price</label>
            <input
              type="number"
              name="originalPrice"
              value={originalPrice}
              className="mt-1 w-full px-3 h-[35px] border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Enter original price..."
            />
          </div>

          <div>
            <label className="pb-1 block">
              Price (With Discount) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="discountPrice"
              value={discountPrice}
              className="mt-1 w-full px-3 h-[35px] border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Enter discount price..."
            />
          </div>
        </div>

        <div>
          <label className="pb-1 block">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={stock}
            className="mt-1 w-full px-3 h-[35px] border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter product stock..."
          />
        </div>

        <div>
          <label className="pb-1 block">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="flex items-center flex-wrap">
            <label htmlFor="upload" className="cursor-pointer">
              <AiOutlinePlusCircle size={30} className="mt-3 text-gray-600" />
            </label>
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt="upload"
                  className="h-[120px] w-[120px] object-cover m-2"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <input
            type="submit"
            value="Create"
            className="mt-2 w-full h-[40px] bg-blue-500 text-white font-semibold rounded-md cursor-pointer hover:bg-blue-600 transition"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
