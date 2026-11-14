// Perfu-Scent storefront preview. Confirm stock, contact details, delivery fees and payment setup with the owner before launch.
const WHATSAPP_NUMBER = ""; // Add the owner's approved international-format number before enabling WhatsApp checkout.
const products = [
  {id:"dezire-red",name:"Dezire Red",category:"Ladies 80ml",description:"80ml fragrance for ladies.",price:150,kind:"ladies",caption:"PERFU-SCENT"},
  {id:"bae",name:"Bae 😍",category:"Ladies 80ml",description:"80ml fragrance for ladies.",price:150,kind:"ladies",caption:"PERFU-SCENT"},
  {id:"dezire-blue",name:"Dezire Blue",category:"Ladies 80ml",description:"80ml fragrance for ladies.",price:150,kind:"ladies",caption:"PERFU-SCENT"},
  {id:"white-oud",name:"White Oud",category:"Unisex 80ml",description:"80ml unisex fragrance.",price:150,kind:"unisex",caption:"PERFU-SCENT"},
  {id:"hamrah",name:"Hamrah",category:"Unisex 80ml",description:"80ml unisex fragrance.",price:150,kind:"unisex",caption:"PERFU-SCENT"},
  {id:"wild",name:"Wild",category:"Gents 80ml",description:"80ml fragrance for gents.",price:150,kind:"gents",caption:"PERFU-SCENT"},
  {id:"warrior",name:"Warrior",category:"Gents 80ml",description:"80ml fragrance for gents.",price:150,kind:"gents",caption:"PERFU-SCENT"},
  {id:"stallion",name:"Stallion",category:"Gents 80ml",description:"80ml fragrance for gents.",price:150,kind:"gents",caption:"PERFU-SCENT"},
  {id:"berry-berry",name:"Berry & Berry",category:"Minies 40ml",description:"40ml mini fragrance.",price:80,kind:"mini",caption:"PERFU-SCENT"},
  {id:"s-candle",name:"S Candle",category:"Minies 40ml",description:"40ml mini fragrance.",price:80,kind:"mini",caption:"PERFU-SCENT"},
  {id:"sugar",name:"Sugar",category:"Minies 40ml",description:"40ml mini fragrance.",price:80,kind:"mini",caption:"PERFU-SCENT"},
  {id:"nomads-land",name:"Nomad's Land",category:"Exclusives 100ml",description:"100ml exclusive fragrance.",price:250,kind:"exclusive",caption:"PERFU-SCENT"},
  {id:"crescendo",name:"Crescendo",category:"Exclusives 100ml",description:"100ml exclusive fragrance.",price:250,kind:"exclusive",caption:"PERFU-SCENT"},
  {id:"galaxy",name:"Galaxy",category:"Exclusives 100ml",description:"100ml exclusive fragrance.",price:250,kind:"exclusive",caption:"PERFU-SCENT"}
];
const categories = ["All", "Ladies 80ml", "Unisex 80ml", "Gents 80ml", "Minies 40ml", "Exclusives 100ml"];
const cart = new Map();
const fmt = n => new Intl.NumberFormat("en-ZA",{style:"currency",currency:"ZAR",maximumFractionDigits:0}).format(n).replace("ZAR","R").trim();
const productGrid = document.getElementById("productGrid");
const filters = document.getElementById("filters");
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2300)}
function renderFilters(){filters.innerHTML=categories.map((c,i)=>`<button class="filter ${i===0?"active":""}" data-filter="${c}">${c==="All"?"All fragrances":c}</button>`).join("")}
function renderProducts(filter="All"){
 const filtered=products.filter(p=>filter==="All"||p.category===filter);
 productGrid.innerHTML=filtered.map(p=>`<article class="product-card"><div class="product-visual ${p.kind}"><div class="symbol">${p.name.replace(" 😍","")}</div><span class="visual-caption">${p.caption}</span></div><div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><p>${p.description}</p><div class="product-foot"><span class="price">${fmt(p.price)}</span><button class="add-button" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button></div></div></article>`).join("");
}
function renderCart(){
 let count=0,total=0;cart.forEach(item=>{count+=item.qty;total+=item.price*item.qty});
 document.getElementById("cartCount").textContent=count;
 document.getElementById("drawerCount").textContent=`(${count})`;
 document.getElementById("cartSubtotal").textContent=fmt(total);
 const empty=cart.size===0;
 document.getElementById("cartEmpty").hidden=!empty;
 document.getElementById("cartBottom").hidden=empty;
 document.getElementById("cartItems").innerHTML=[...cart.values()].map(item=>`<div class="cart-line"><div><h3>${item.name}</h3><small>${fmt(item.price)} each</small><div class="qty-control"><button data-qty="${item.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${item.id}" data-change="1" aria-label="Increase quantity">+</button><button class="remove-line" data-remove="${item.id}">Remove</button></div></div><strong>${fmt(item.price*item.qty)}</strong></div>`).join("");
}
function addItem(item){const existing=cart.get(item.id);if(existing)existing.qty++;else cart.set(item.id,{...item,qty:1});renderCart();showToast(`${item.name} added to your bag`)}
function openCart(){document.getElementById("cartOverlay").hidden=false;document.getElementById("cartDrawer").classList.add("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeCart(){document.getElementById("cartOverlay").hidden=true;document.getElementById("cartDrawer").classList.remove("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","true");document.body.style.overflow=""}
filters.addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(!btn)return;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===btn));renderProducts(btn.dataset.filter)});
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add){const p=products.find(x=>x.id===add.dataset.add);if(p)addItem(p);return}
 const qty=e.target.closest("[data-qty]");if(qty){const item=cart.get(qty.dataset.qty);if(item){item.qty+=Number(qty.dataset.change);if(item.qty<=0)cart.delete(item.id);renderCart()}return}
 const remove=e.target.closest("[data-remove]");if(remove){cart.delete(remove.dataset.remove);renderCart()}
});
document.getElementById("cartTrigger").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("cartOverlay").addEventListener("click",closeCart);
document.getElementById("continueShopping").addEventListener("click",closeCart);
document.getElementById("checkoutButton").addEventListener("click",()=>{
 if(cart.size===0)return;
 const lines=[...cart.values()].map(i=>`${i.qty} x ${i.name} — ${fmt(i.price*i.qty)}`);
 const total=[...cart.values()].reduce((sum,i)=>sum+i.price*i.qty,0);
 const message=`Hello Perfu-Scent, I would like to enquire about this order:\\n${lines.join("\\n")}\\nSubtotal: ${fmt(total)}\\nPlease confirm availability, Aramex/PAXI delivery fee and payment options.`;
 if(!WHATSAPP_NUMBER){alert("Store preview only. Confirm the owner's WhatsApp number and configure secure checkout before launch.\\n\\nOrder summary:\\n"+lines.join("\\n")+"\\nSubtotal: "+fmt(total));return}
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener");
});
document.getElementById("year").textContent=new Date().getFullYear();
renderFilters();renderProducts();renderCart();
