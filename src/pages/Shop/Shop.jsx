import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown, ChevronRight, ChevronLeft,
  Loader2, Search, Star, X, SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/Footer";
import {
  clearProductMessages,
  fetchProducts,
} from "../../ReduxSetUp/Feature/Products/ProductSlice";

/* ── constants ── */
const FALLBACK_IMAGE = "/Pictures/pexels-ian-panelo-7716266.jpg";
const DEFAULT_SIZE_OPTIONS = ["XX-Small","X-Small","Small","Medium","Large","X-Large","XX-Large","3X-Large"];
const DRESS_STYLE_OPTIONS  = ["Casual","Formal","Party","Gym"];
const PRODUCTS_PER_PAGE    = 9;

/* ── helpers ── */
const fmt = (n) =>
  new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(Number(n||0));
const norm   = (v) => String(v||"").trim().toLowerCase();
const label  = (v) => !v ? "" : String(v).split(/[\s_-]+/).filter(Boolean).map(p=>p[0].toUpperCase()+p.slice(1)).join(" ");
const img0   = (p) => p?.images?.[0] || FALLBACK_IMAGE;
const price  = (p) => Number(p?.discountPrice)>0 ? Number(p.discountPrice) : Number(p?.price||0);

const sizes = (p) => {
  if (!Array.isArray(p?.variants)) return [];
  const s = [...new Set(p.variants.map(v=>v?.size).filter(x=>x!=null&&x!=="").map(String))];
  s.sort((a,b)=>{const na=parseFloat(a),nb=parseFloat(b);return !isNaN(na)&&!isNaN(nb)?na-nb:a.localeCompare(b);});
  return s;
};
const colors = (p) => !Array.isArray(p?.variants)?[]: [...new Set(p.variants.map(v=>v?.color).filter(Boolean).map(String))];


const Stars = ({rating=0}) => {
  const n=Number(rating||0);
  return <>{Array.from({length:5},(_,i)=>(
    <Star key={i} size={12} className={i<Math.round(n)?"fill-amber-400 text-amber-400":"fill-gray-200 text-gray-200"}/>
  ))}</>;
};

/* ── Collapsible filter section ── */
function Sec({title,open:initOpen=true,children}){
  const [open,setOpen]=useState(initOpen);
  return (
    <div className="py-4 border-b border-gray-200 last:border-0">
      <button type="button" onClick={()=>setOpen(c=>!c)}
        className="flex w-full items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        <ChevronDown size={15} className={`text-gray-500 transition-transform ${open?"rotate-180":""}`}/>
      </button>
      <AnimatePresence initial={false}>
        {open&&(
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}}
            exit={{height:0,opacity:0}} transition={{duration:0.2}} className="overflow-hidden">
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sidebar ── */
function Sidebar({
  categoryOptions , shoeSizes,
  selectedCategory,setSelectedCategory,
  selectedSize,setSelectedSize,
  selectedStyle,setSelectedStyle,
  priceMin,priceMax,setPriceMax,maxPrice,
  onApply,onClose,
}){
  return (
    <div className="w-full">
      {/* header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <span className="text-base font-bold text-gray-900">Filters</span>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-gray-500"/>
          <button type="button" onClick={onClose} className="lg:hidden ml-1">
            <X size={15} className="text-gray-500"/>
          </button>
        </div>
      </div>

      {/* Category */}
      <Sec title="Category">
        <ul className="space-y-0.5">
          {["all",...categoryOptions].map(cat=>(
            <li key={cat}>
              <button type="button" onClick={()=>setSelectedCategory(cat)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-sm transition
                  ${norm(selectedCategory)===norm(cat)?"font-semibold text-gray-900":"text-gray-500 hover:text-gray-900"}`}>
                <span>{cat==="all"?"All":label(cat)}</span>
                <ChevronRight size={13} className="text-gray-400"/>
              </button>
            </li>
          ))}
        </ul>
      </Sec>

      {/* Price */}
      <Sec title="Price">
        <div className="space-y-3 px-3">
          {/* dual-looking range — single handle max */}
          <div className="relative h-1.5 rounded-full bg-gray-200">
            <div className="absolute left-0 top-0 h-full rounded-full bg-black"
              style={{width:`${maxPrice>0?(priceMax/maxPrice)*100:0}%`}}/>
            <input type="range" min={0} max={maxPrice||1000} value={priceMax}
              onChange={e=>setPriceMax(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={maxPrice===0}/>
            {/* thumb visual */}
            <div className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white border-2 border-black shadow pointer-events-none"
              style={{left:`calc(${maxPrice>0?(priceMax/maxPrice)*100:0}% - 8px)`}}/>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{fmt(priceMin)}</span>
            <span>{fmt(priceMax||maxPrice)}</span>
          </div>
        </div>
      </Sec>

      {/* Size */}
      <Sec title="Size">
        <div className="flex flex-wrap gap-2">
          {(shoeSizes.length>0?shoeSizes:DEFAULT_SIZE_OPTIONS).map(s=>(
            <button key={s} type="button"
              onClick={()=>setSelectedSize(norm(selectedSize)===norm(s)?"":String(s))}
              className={`rounded-full px-3 py-1.5 text-xs font-medium border transition
                ${norm(selectedSize)===norm(s)
                  ?"bg-black text-white border-black"
                  :"bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
              {s}
            </button>
          ))}
        </div>
      </Sec>

      {/* Dress Style */}
      <Sec title="Dress Style">
        <ul className="space-y-0.5">
          {DRESS_STYLE_OPTIONS.map(style=>(
            <li key={style}>
              <button type="button" onClick={()=>setSelectedStyle(selectedStyle===style?"":style)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-sm transition
                  ${selectedStyle===style?"font-semibold text-gray-900":"text-gray-500 hover:text-gray-900"}`}>
                <span>{style}</span>
                <ChevronRight size={13} className="text-gray-400"/>
              </button>
            </li>
          ))}
        </ul>
      </Sec>

      {/* Apply button */}
      <div className="pt-4">
        <button type="button" onClick={onApply}
          className="w-full rounded-full bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800 transition">
          Apply Filter
        </button>
      </div>
    </div>
  );
}

/* ── Product Card ── */
function Card({product}){
  if(!product) return null;
  const id  = product._id||product.id;
  const p   = price(product);
  const hasDisc = Number(product.discountPrice)>0 && Number(product.discountPrice)<Number(product.price);
  const pct = hasDisc ? Math.round((1-Number(product.discountPrice)/Number(product.price||1))*100) : 0;

  return (
    <Link to={`/products/${id}`} state={{product}} className="group block">
      <article className="flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-md transition-shadow duration-300">
        {/* image area */}
        <div className="relative  overflow-hidden">
          <div className="aspect-[4/4]  p-2">
            <img src={img0(product)} alt={product.name}
              className="h-full w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"/>
          </div>
        </div>

        {/* text */}
        <div className="px-3 pb-3 pt-3 space-y-1.5">
          <h2 className="font-bold text-gray-900 leading-snug truncate">{product.name}</h2>

          {/* stars */}
          <div className="flex items-center gap-1">
            <Stars rating={product.rating}/>
            <span className="text-[11px] text-gray-500 ml-0.5">
              {Number(product.rating||0).toFixed(1)}/5
            </span>
          </div>

          {/* price */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-base font-bold text-gray-900">{fmt(p)}</span>
            {hasDisc && (
              <>
                <span className="text-gray-400 line-through">{fmt(product.price)}</span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-500">
                  -{pct}%
                </span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ── Main page ── */
export default function ShopPage(){
  const dispatch = useDispatch();
  const {products,loading,error} = useSelector(s=>s.products);

  const [search,setSearch]       = useState("");
  const [sort,setSort]           = useState("popular");
  const [showSidebar,setShowSidebar] = useState(()=>typeof window!=="undefined"?window.innerWidth>=1024:true);
  const [selCat,setSelCat]       = useState("all");
  const [selColor,setSelColor]   = useState("all");
  const [selSize,setSelSize]     = useState("");
  const [selStyle,setSelStyle]   = useState("");
  const [priceMax,setPriceMax]   = useState(0);
  const [page,setPage]           = useState(1);

  useEffect(()=>{
    if(products.length===0) dispatch(fetchProducts());
    return ()=>{ dispatch(clearProductMessages()); };
  },[dispatch,products.length]);

  const maxPrice = useMemo(()=>products.reduce((m,p)=>Math.max(m,price(p)),0),[products]);

  useEffect(()=>{
    if(maxPrice<=0) return;
    setPriceMax(c=>c===0||c>maxPrice?maxPrice:c);
  },[maxPrice]);

  useEffect(()=>{setPage(1);},[search,selCat,selColor,selSize,selStyle,priceMax,sort]);

  const catOptions   = useMemo(()=>[...new Set(products.map(p=>p.category||p.gender).filter(Boolean).map(String))]   ,[products]);
  const colorOptions = useMemo(()=>[...new Set(products.flatMap(colors))]                                              ,[products]);
  const sizeOptions  = useMemo(()=>[...new Set(products.flatMap(sizes))]                                               ,[products]);

  const filtered = useMemo(()=>{
    const t=norm(search);
    let list=[...products];
    if(t) list=list.filter(p=>[p.name,p.brand,p.category,p.description,p.gender,...(p.tags||[])].filter(Boolean).join(" ").toLowerCase().includes(t));
    if(selCat!=="all") list=list.filter(p=>norm(p.category||p.gender)===norm(selCat));
    if(selColor!=="all") list=list.filter(p=>{const c=colors(p);return c.length===0||c.some(x=>norm(x)===norm(selColor));});
    if(selSize) list=list.filter(p=>{const s=sizes(p);return s.length===0||s.some(x=>norm(x)===norm(selSize));});
    if(priceMax>0) list=list.filter(p=>price(p)<=priceMax);
    switch(sort){
      case"newest": list.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)); break;
      case"low":    list.sort((a,b)=>price(a)-price(b)); break;
      case"high":   list.sort((a,b)=>price(b)-price(a)); break;
      case"name":   list.sort((a,b)=>String(a.name||"").localeCompare(String(b.name||""))); break;
      default: list.sort((a,b)=>{const r=Number(b.rating||0)-Number(a.rating||0);return r!==0?r:Number(b.numReviews||0)-Number(a.numReviews||0);});
    }
    return list;
  },[products,search,selCat,selColor,selSize,priceMax,sort]);

  const totalPages = Math.max(1,Math.ceil(filtered.length/PRODUCTS_PER_PAGE));
  const paged      = filtered.slice((page-1)*PRODUCTS_PER_PAGE,page*PRODUCTS_PER_PAGE);

  const pageNums = ()=>{
    if(totalPages<=7) return Array.from({length:totalPages},(_,i)=>i+1);
    const p=[];
    p.push(1);
    if(page>3) p.push("…");
    for(let i=Math.max(2,page-1);i<=Math.min(totalPages-1,page+1);i++) p.push(i);
    if(page<totalPages-2) p.push("…");
    p.push(totalPages);
    return p;
  };

  const catLabel = selCat==="all"?"Casual":label(selCat);

  /* guards */
  if(loading&&products.length===0)
    return <div className="flex min-h-screen items-center justify-center bg-white pt-28"><Loader2 size={36} className="animate-spin text-gray-400"/></div>;

  if(error)
    return <section className="min-h-screen bg-white px-4 pt-28"><div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600">{error}</div></section>;

  if(products.length===0)
    return <><section className="min-h-screen bg-white px-4 pt-28"><div className="mx-auto max-w-7xl rounded-2xl border border-gray-100 bg-gray-50 px-6 py-20 text-center"><h2 className="text-2xl font-bold text-gray-900">No Products Found</h2></div></section><Footer/></>;

  return (
    <>
      <section className="min-h-screen bg-white pt-24 sm:pt-28">
        <div className="mx-auto  px-10 sm:px-6 lg:px-8 pb-16">

          {/* breadcrumb */}
          <nav className="mb-5 flex items-center gap-1.5  text-gray-400">
            <Link to="/" className="hover:text-gray-700 transition">Home</Link>
            <ChevronRight size={11}/>
            <span className="text-gray-700">{catLabel}</span>
          </nav>

          {/* two-column layout */}
          <div className="flex lg:gap-10 gap-6">

            {/* ── SIDEBAR ── */}
            {showSidebar && (
              <aside className="hidden lg:block shrink-0 w-[300px] self-start sticky top-24">
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <Sidebar
                    categoryOptions={catOptions} colorOptions={colorOptions} shoeSizes={sizeOptions}
                    selectedCategory={selCat}   setSelectedCategory={setSelCat}
                    selectedSize={selSize}       setSelectedSize={setSelSize}
                    selectedStyle={selStyle}     setSelectedStyle={setSelStyle}
                    priceMin={0} priceMax={priceMax} setPriceMax={setPriceMax} maxPrice={maxPrice}
                    onApply={()=>{}}
                    onClose={()=>setShowSidebar(false)}/>
                </div>
              </aside>
            )}

            {/* ── RIGHT CONTENT ── */}
            <div className="flex-1 min-w-0">

              {/* top bar — title+count LEFT, sort RIGHT (matches screenshot) */}
              <div className="mb-5 flex items-center justify-between gap-4">
                {/* LEFT: title + product count */}
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-gray-900">{catLabel}</h1>
                  <p className="text-xs text-gray-400">
                    Showing {filtered.length===0?0:(page-1)*PRODUCTS_PER_PAGE+1}–{Math.min(page*PRODUCTS_PER_PAGE,filtered.length)} of {filtered.length} Products
                  </p>
                </div>

                {/* RIGHT: search + sort */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* mobile filter btn */}
                  <button type="button" onClick={()=>setShowSidebar(c=>!c)}
                    className="lg:hidden inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-2 text-gray-600 hover:bg-gray-50">
                    <SlidersHorizontal size={13}/>
                  </button>

                  {/* search */}
                  <div className="relative hidden sm:block">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    <input type="search" value={search} onChange={e=>setSearch(e.target.value)}
                      placeholder="Search products…"
                      className="rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-gray-900 outline-none focus:border-gray-400 w-44"/>
                  </div>

                  {/* Sort by — right side */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500 whitespace-nowrap">Sort by:</span>
                    <select value={sort} onChange={e=>setSort(e.target.value)}
                      className="rounded-full border border-gray-200 bg-white px-3 py-2 font-semibold text-gray-900 outline-none focus:border-gray-400 cursor-pointer">
                      <option value="popular">Most Popular</option>
                      <option value="newest">Newest</option>
                      <option value="low">Price: Low → High</option>
                      <option value="high">Price: High → Low</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* loading */}
              {loading && <div className="flex h-60 items-center justify-center"><Loader2 size={32} className="animate-spin text-gray-300"/></div>}

              {/* no results */}
              {!loading&&!error&&filtered.length===0&&(
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-20 text-center">
                  <h2 className="text-xl font-bold text-gray-900">No Products Found</h2>
                  <p className="mt-2 text-sm text-gray-400">Try adjusting your filters.</p>
                </div>
              )}

              {/* product grid — 3 columns matching the screenshot */}
              {!loading&&!error&&paged.length>0&&(
                <div className="grid grid-cols-2 gap-4 lg:gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {paged.map(p=><Card key={p._id||p.id} product={p}/>)}
                </div>
              )}

              {/* ── pagination ── */}
              {!loading&&filtered.length>PRODUCTS_PER_PAGE&&(
                <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
                  <button type="button" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition">
                    <ChevronLeft size={13}/>Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {pageNums().map((n,i)=>
                      n==="…"
                        ?<span key={`e${i}`} className="px-1 text-sm text-gray-400">…</span>
                        :<button key={n} type="button" onClick={()=>setPage(n)}
                            className={`h-9 w-9 rounded-full text-sm font-medium transition
                              ${page===n?"bg-black text-white":"text-gray-600 hover:bg-gray-100"}`}>
                            {n}
                          </button>
                    )}
                  </div>

                  <button type="button" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition">
                    Next<ChevronRight size={13}/>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer/>

      {/* mobile drawer */}
      <AnimatePresence>
        {showSidebar&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 lg:hidden">
            <button type="button" aria-label="close" className="absolute inset-0 bg-black/40" onClick={()=>setShowSidebar(false)}/>
            <motion.aside initial={{x:"-100%"}} animate={{x:0}} exit={{x:"-100%"}}
              transition={{type:"spring",damping:26,stiffness:200}}
              className="absolute left-0 top-0 h-full w-[85%] max-w-[320px] overflow-y-auto bg-white p-5 shadow-xl">
              <Sidebar
                categoryOptions={catOptions} colorOptions={colorOptions} shoeSizes={sizeOptions}
                selectedCategory={selCat}   setSelectedCategory={setSelCat}
                selectedColor={selColor}     setSelectedColor={setSelColor}
                selectedSize={selSize}       setSelectedSize={setSelSize}
                selectedStyle={selStyle}     setSelectedStyle={setSelStyle}
                priceMin={0} priceMax={priceMax} setPriceMax={setPriceMax} maxPrice={maxPrice}
                onApply={()=>setShowSidebar(false)}
                onClose={()=>setShowSidebar(false)}/>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}