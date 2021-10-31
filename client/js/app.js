const addBtn = document.querySelector("#add-product-btn");
const container = document.querySelector("#products-container");
const URL_API = "http://localhost:4000/api";
let products = [];

window.addEventListener("DOMContentLoaded", function () {
	getProducts();

	addBtn.addEventListener("click", addProductForm);
	container.addEventListener("click", deleteProduct);
	container.addEventListener("click", editProductForm);
});

class UI {
	showProducts() {
		container.innerHTML = "";
		products.forEach((product) => {
			const { _id, name, color, price } = product;

			const article = document.createElement("article");
			article.className = "card-product";
			article.innerHTML = `
			<p class="card-product__text"><strong>Name: </strong>${name}</p>
					<p class="card-product__text"><strong>Color: </strong>${color}</p>
					<p class="card-product__text"><strong>Price: </strong>${price}</p>
					<button class="card-product__btn-edit" data-id="${_id}">
						<i class="bi bi-pencil-fill"></i> Edit
					</button>
					<button class="card-product__btn-delete" data-id="${_id}">
						<i class="bi bi-trash2-fill"></i> Delete
					</button>`;

			container.appendChild(article);
		});
	}

	showAddProduct() {
		const section = document.createElement("section");
		section.className = "modal-container";

		const box = document.createElement("div");
		box.className = "modal";
		box.innerHTML = `<i id="close-modal" onclick="closeModal()" class="bi bi-x-circle-fill modal__close-icon"></i>
		<p id="modal-title" class="modal__title">Add product</p>
		<form id="add-product-form">
			<input class="modal__input" type="text" name="name" placeholder="Name" required>
			<input class="modal__input" type="text" name="color" placeholder="Color" required>
			<input class="modal__input" type="text" name="price" placeholder="Price" required>
			</form>
			<button class="modal__btn-cancel" onclick="closeModal()">Cancel</button>
			<button class="modal__btn-save" form="add-product-form">Save</button>
		`;

		section.appendChild(box);
		document.body.appendChild(section);
		this.modalTransition();
	}

	showEditProduct(id) {
		// Get data product for values
		const product = products.find((product) => product._id === id);
		const { _id, name, color, price } = product;

		const section = document.createElement("section");
		section.className = "modal-container";

		const box = document.createElement("div");
		box.className = "modal";
		box.innerHTML = `<i id="close-modal" onclick="closeModal()" class="bi bi-x-circle-fill modal__close-icon"></i>
		<p id="modal-title" class="modal__title">Edit product</p>
			<form id="edit-product-form">
				<input type="hidden" name="id" value="${_id}" required>
				<input class="modal__input" type="text" value="${name}" name="name" placeholder="Name" required>
				<input class="modal__input" type="text" value="${color}" name="color" placeholder="Color" required>
				<input class="modal__input" type="text" value="${price}" name="price" placeholder="Price" required>
				</form>
				<button class="modal__btn-cancel" onclick="closeModal()">Cancel</button>
				<button class="modal__btn-save" form="edit-product-form">Save changes</button>
				`;

		section.appendChild(box);
		document.body.appendChild(section);
		this.modalTransition();
	}

	showDeleteProduct(id) {
		const section = document.createElement("section");
		section.className = "modal-container";

		const box = document.createElement("div");
		box.className = "modal";
		box.innerHTML = `<i id="close-modal" onclick="closeModal()" class="bi bi-x-circle-fill modal__close-icon"></i>
		<p id="modal-title" class="modal__title">Delete</p>
		<p id="modal-title" class="modal__text">¿Are you sure to delete?</p>
		<button class="modal__btn-no" onclick="closeModal()">No</button>
		<button id="delete-product-true" class="modal__btn-yes">Yes</button>`;

		section.appendChild(box);
		document.body.appendChild(section);

		// Delete product
		const deleteProductBtn = document.querySelector("#delete-product-true");
		deleteProductBtn.addEventListener("click", () => {
			fetch(`${URL_API}?id=${id}`, {
				method: "DELETE",
			})
				.then((res) => res.json())
				.then((response) => {
					getProducts();
					this.modalTransition();
					ui.showMessage(response.message, "error");
				})
				.catch((e) => ui.showMessage("Ocurrió un error", "error"));
		});

		this.modalTransition();
	}

	modalTransition() {
		const modal = document.querySelector(".modal-container");
		if (modal.style.opacity === "") {
			modal.style.opacity = "0";
			setTimeout(() => {
				modal.style.opacity = "1";
			}, 100);
		} else if (modal.style.opacity === "1") {
			setTimeout(() => {
				modal.style.opacity = "0";
				setTimeout(() => {
					document.querySelector(".modal-container").remove();
				}, 100);
			}, 100);
		}
	}

	showMessage(message, style = "success") {
		const messageDiv = document.createElement("div");
		messageDiv.className = `message ${style}`;
		const text = document.createElement("p");
		text.className = "message__text";
		text.textContent = message;
		messageDiv.appendChild(text);
		messageDiv.style.opacity = "0";

		document.body.appendChild(messageDiv);
		messageDiv.style.opacity = "1";

		setTimeout(() => {
			messageDiv.style.opacity = "0";
			setTimeout(() => messageDiv.remove(), 100);
		}, 2000);
	}
}

const ui = new UI();

function addProductForm() {
	ui.showAddProduct();
	const formAddProduct = document.querySelector("#add-product-form");
	formAddProduct.addEventListener("submit", addProduct);
}

function getProducts() {
	fetch(URL_API)
		.then((res) => res.json())
		.then((data) => {
			products = data;
			ui.showProducts();
		})
		.catch((e) => window.location.reload());
}

function addProduct(e) {
	e.preventDefault();

	const data = new FormData(e.target);
	const product = {
		name: data.get("name"),
		color: data.get("color"),
		price: data.get("price"),
	};

	fetch(URL_API, {
		method: "POST",
		body: JSON.stringify(product),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => res.json())
		.then((response) => {
			getProducts();
			closeModal();
			ui.showMessage(response.message);
		})
		.catch((e) => ui.showMessage("Ocurrió un error", "error"));
}

function editProductForm(e) {
	if (e.target.classList.contains("card-product__btn-edit")) {
		const idProduct = e.target.getAttribute("data-id");

		ui.showEditProduct(idProduct);
		const formEditProduct = document.querySelector("#edit-product-form");
		formEditProduct.addEventListener("submit", editProduct);
	}
}

function editProduct(e) {
	e.preventDefault();

	const data = new FormData(e.target);
	const newProduct = {
		id: data.get("id"),
		name: data.get("name"),
		color: data.get("color"),
		price: data.get("price"),
	};

	fetch(`${URL_API}?id=${newProduct.id}`, {
		method: "PUT",
		body: JSON.stringify(newProduct),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => res.json())
		.then((response) => {
			getProducts();
			closeModal();
			ui.showMessage(response.message);
		})
		.catch((e) => ui.showMessage("Ocurrió un error", "error"));
}

function deleteProduct(e) {
	if (e.target.classList.contains("card-product__btn-delete")) {
		const idProduct = e.target.getAttribute("data-id");

		ui.showDeleteProduct(idProduct);
	}
}

function closeModal() {
	ui.modalTransition();
}
