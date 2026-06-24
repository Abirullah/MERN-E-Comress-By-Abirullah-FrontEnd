import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown, ChevronRight, ChevronLeft,
  Loader2, Search, X, SlidersHorizontal,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import {
  clearProductMessages,
  fetchProducts,
} from "../../ReduxSetUp/Feature/Products/ProductSlice";
import {
  formatFilterLabel,
  normalizeBrandValue,
} from "../../utils/shopLinks";
import ProductCard from "../../components/ProductCard";

/* ── constants ── */
const DEFAULT_SIZE_OPTIONS = ["XX-Small","X-Small","Small","Medium","Large","X-Large","XX-Large","3X-Large"];
const DEFAULT_BRAND_OPTIONS = ["Nike", "Adidas", "Puma", "Reebok", "Vans", "New Balance", "Skechers", "Jordan"];
const DRESS_STYLE_OPTIONS  = ["Casual","Formal","Party","Gym"];
const PRODUCTS_PER_PAGE    = 9;

/* ── helpers ── */
const fmt = (n) =>
  new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(Number(n||0));
const norm   = (v) => String(v||"").trim().toLowerCase();
const label  = (v) => !v ? "" : String(v).split(/[\s_-]+/).filter(Boolean).map(p=>p[0].toUpperCase()+p.slice(1)).join(" ");
const price  = (p) => Number(p?.discountPrice)>0 ? Number(p.discountPrice) : Number(p?.price||0);

const sizes = (p) => {
  if (!Array.isArray(p?.variants)) return [];
  const s = [...new Set(p.variants.map(v=>v?.size).filter(x=>x!=null&&x!=="").map(String))];
  s.sort((a,b)=>{const na=parseFloat(a),nb=parseFloat(b);return !isNaN(na)&&!isNaN(nb)?na-nb:a.localeCompare(b);});
  return s;
};
const colors = (p) => !Array.isArray(p?.variants)?[]: [...new Set(p.variants.map(v=>v?.color).filter(Boolean).map(String))];

/* ── Collapsible filter section ── */
function Sec({title,open:initOpen=true,children}){
  const [open,setOpen]=useState(initOpen);
  return (
    <div className="py-4 border-b border-[#1e1e1e] last:border-0">
      <button type="button" onClick={()=>setOpen(c=>!c)}
        className="flex w-full items-center justify-between">
        <span className="text-sm font-semibold text-[#ddd4be]">{title}</span>
        <ChevronDown size={15} className={`text-[#5a5a5a] transition-transform ${open?"rotate-180":""}`}/>
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
  categoryOptions, brandOptions, shoeSizes,
  selectedCategory, setSelectedCategory,
  selectedBrand, setSelectedBrand,
  selectedSize, setSelectedSize,
  selectedStyle, setSelectedStyle,
  priceMin, priceMax, setPriceMax, maxPrice,
  onApply, onClose,
}){
  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-4 border-b border-[#1e1e1e]">
        <span className="text-base font-bold text-[#ddd4be]">Filters</span>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#5a5a5a]"/>
          <button type="button" onClick={onClose} className="lg:hidden ml-1 p-1">
            <X size={16} className="text-[#5a5a5a]"/>
          </button>
        </div>
      </div>

      <Sec title="Category">
        <ul className="space-y-0.5">
          {["all",...categoryOptions].map(cat=>(
            <li key={cat}>
              <button type="button" onClick={()=>setSelectedCategory(cat)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-2.5 text-sm transition
                  ${norm(selectedCategory)===norm(cat)?"font-semibold text-[#d4a544]":"text-[#6b6666] hover:text-[#ddd4be]"}`}>
                <span>{cat==="all"?"All":label(cat)}</span>
                <ChevronRight size={13} className="text-[#5a5a5a]"/>
              </button>
            </li>
          ))}
        </ul>
      </Sec>

      <Sec title="Brand">
        <ul className="space-y-0.5">
          {["all", ...brandOptions].map((brand) => {
            const brandLabel = brand === "all" ? "All" : formatFilterLabel(brand);
            return (
              <li key={brand}>
                <button type="button" onClick={() => setSelectedBrand(brand)}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-2.5 text-sm transition
                    ${norm(selectedBrand)===norm(brand)?"font-semibold text-[#d4a544]":"text-[#6b6666] hover:text-[#ddd4be]"}`}>
                  <span>{brandLabel}</span>
                  <ChevronRight size={13} className="text-[#5a5a5a]"/>
                </button>
              </li>
            );
          })}
        </ul>
      </Sec>

      <Sec title="Price">
        <div className="space-y-3 px-1">
          <div className="relative h-1.5 rounded-full bg-[#1e1e1e]">
            <div className="absolute left-0 top-0 h-full rounded-full bg-[#d4a544]"
              style={{width:`${maxPrice>0?(priceMax/maxPrice)*100:0}%`}}/>
            <input type="range" min={0} max={maxPrice||1000} value={priceMax}
              onChange={e=>setPriceMax(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={maxPrice===0}/>
            <div className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#0e0e0e] border-2 border-[#d4a544] shadow pointer-events-none"
              style={{left:`calc(${maxPrice>0?(priceMax/maxPrice)*100:0}% - 8px)`}}/>
          </div>
          <div className="flex justify-between text-[10px] text-[#5a5a5a]">
            <span>{fmt(priceMin)}</span>
            <span>{fmt(priceMax||maxPrice)}</span>
          </div>
        </div>
      </Sec>

      <Sec title="Size">
        <div className="flex flex-wrap gap-2">
          {(shoeSizes.length>0?shoeSizes:DEFAULT_SIZE_OPTIONS).map(s=>(
            <button key={s} type="button"
              onClick={()=>setSelectedSize(norm(selectedSize)===norm(s)?"":String(s))}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] border transition-all duration-300
                ${norm(selectedSize)===norm(s)
                  ?"bg-[#d4a544] text-[#080808] border-[#d4a544]"
                  :"bg-[#0e0e0e] text-[#6b6666] border-[#1e1e1e] hover:border-[#d4a544]/50 hover:text-[#d4a544]"}`}>
              {s}
            </button>
          ))}
        </div>
      </Sec>

      <Sec title="Dress Style">
        <ul className="space-y-0.5">
          {DRESS_STYLE_OPTIONS.map(style=>(
            <li key={style}>
              <button type="button" onClick={()=>setSelectedStyle(selectedStyle===style?"":style)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-2.5 text-sm transition
                  ${selectedStyle===style?"font-semibold text-[#d4a544]":"text-[#6b6666] hover:text-[#ddd4be]"}`}>
                <span>{style}</span>
                <ChevronRight size={13} className="text-[#5a5a5a]"/>
              </button>
            </li>
          ))}
        </ul>
      </Sec>

      <div className="pt-5">
        <button type="button" onClick={onApply}
          className="w-full rounded-xl bg-[#d4a544] py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#080808] hover:bg-[#c19a3e] transition-all duration-300 shadow-lg shadow-[#d4a544]/10">
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
      <article className="flex flex-col rounded-xl overflow-hidden bg-[#0e0e0e] border border-[#1e1e1e] hover:border-[#d4a544]/30 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-0.5">
        {/* image */}
        <div className="relative overflow-hidden">
          <div className="aspect-square p-1.5">
            <img
              src={img0(product)}
              alt={product.name}
              className="h-full w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {/* discount badge on image */}
          {hasDisc && (
            <span className="absolute top-3 left-3 rounded-md bg-[#d4a544] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#080808]">
              -{pct}%
            </span>
          )}
        </div>

        {/* info */}
        <div className="px-2.5 pb-3 pt-2 space-y-1">
          <h2 className="text-[13px] font-bold text-[#ddd4be] leading-snug line-clamp-2 group-hover:text-[#d4a544] transition-colors">
            {product.name}
          </h2>
          <div className="flex items-center gap-1">
            <Stars rating={product.rating}/>
            <span className="text-[10px] text-[#5a5a5a]">
              {Number(product.rating||0).toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
            <span className="text-sm font-bold text-[#ddd4be]">{fmt(p)}</span>
            {hasDisc && (
              <span className="text-[11px] text-[#5a5a5a] line-through">{fmt(product.price)}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ── Mobile search bar ── */
function MobileSearch({value, onChange}){
  return (
    <div className="relative sm:hidden mb-4">
      <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5a5a5a] pointer-events-none"/>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search products…"
        className="w-full rounded-xl border border-[#1e1e1e] bg-[#0e0e0e] py-2.5 pl-9 pr-4 text-sm text-[#ddd4be] outline-none focus:border-[#d4a544]/50 placeholder:text-[#5a5a5a]"
      />
    </div>
  );
}

/* ── Main page ── */
export default function ShopPage(){
  const dispatch = useDispatch();
  const {products, loading, error} = useSelector(s => s.products);
  const [searchParams, setSearchParams] = useSearchParams();

  const [selColor,    setSelColor]    = useState("all");
  const [selSize,     setSelSize]     = useState("");
  const [selStyle,    setSelStyle]    = useState("");
  const [priceMax,    setPriceMax]    = useState(0);
  const [page,        setPage]        = useState(1);
  const [showSidebar, setShowSidebar] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  const search    = searchParams.get("search")   || "";
  const sort      = searchParams.get("sort")     || "popular";
  const selBrand  = searchParams.get("brand")    || "all";
  const selGender = searchParams.get("gender")   || "all";
  const selCat    = searchParams.get("category") || "all";
  const isSale    = searchParams.get("sale")     === "true";

  const updateParam = useCallback((key, value, defaultValue = "") => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (!value || value === defaultValue) next.delete(key);
      else next.set(key, value);
      return next;
    }, { replace: true });
    setPage(1);
  }, [setSearchParams]);

  const setSearch    = useCallback((v) => updateParam("search",   v),              [updateParam]);
  const setSort      = useCallback((v) => updateParam("sort",     v, "popular"),   [updateParam]);
  const setSelBrand  = useCallback((v) => updateParam("brand",    v, "all"),       [updateParam]);
  const setSelGender = useCallback((v) => updateParam("gender",   v, "all"),       [updateParam]);
  const setSelCat    = useCallback((v) => updateParam("category", v, "all"),       [updateParam]);
  const setIsSale    = useCallback((v) => updateParam("sale",     v ? "true" : ""), [updateParam]);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
    return () => { dispatch(clearProductMessages()); };
  }, [dispatch]);

  const maxPrice = useMemo(() =>
    products.reduce((m, p) => Math.max(m, price(p)), 0),
  [products]);

  useEffect(() => {
    if (maxPrice <= 0) return;
    setPriceMax(c => c === 0 || c > maxPrice ? maxPrice : c);
  }, [maxPrice]);

  useEffect(() => { setPage(1); }, [search, selBrand, selCat, selGender, selColor, selSize, selStyle, priceMax, sort, isSale]);

  const catOptions   = useMemo(() => [...new Set(products.map(p => p.category || p.gender).filter(Boolean).map(String))], [products]);
  const brandOptions = useMemo(() => {
    const seen = new Map();
    products.forEach((product) => {
      const brand = String(product?.brand || "").trim();
      if (!brand) return;
      const key = normalizeBrandValue(brand);
      if (!key || seen.has(key)) return;
      seen.set(key, brand);
    });
    const currentBrands = Array.from(seen.values());
    return currentBrands.length > 0 ? currentBrands.sort((a, b) => a.localeCompare(b)) : DEFAULT_BRAND_OPTIONS;
  }, [products]);
  const sizeOptions = useMemo(() => [...new Set(products.flatMap(sizes))], [products]);

  const filtered = useMemo(() => {
    const t = norm(search);
    let list = [...products];
    if (t) list = list.filter(p =>
      [p.name, p.brand, p.category, p.description, p.gender, p.status, ...(p.tags||[])].filter(Boolean).join(" ").toLowerCase().includes(t)
    );
    if (selBrand !== "all") list = list.filter(p => normalizeBrandValue(p.brand) === normalizeBrandValue(selBrand));
    if (selGender !== "all") list = list.filter(p =>
      norm(p.gender||"") === norm(selGender) || norm(p.category||"") === norm(selGender)
    );
    if (selCat !== "all") list = list.filter(p => norm(p.category||"") === norm(selCat));
    if (isSale) list = list.filter(p => Number(p.discountPrice) > 0 || p.onSale === true || p.sale === true);
    if (selColor !== "all") list = list.filter(p => { const c = colors(p); return c.length === 0 || c.some(x => norm(x) === norm(selColor)); });
    if (selSize) list = list.filter(p => { const s = sizes(p); return s.length === 0 || s.some(x => norm(x) === norm(selSize)); });
    if (priceMax > 0) list = list.filter(p => price(p) <= priceMax);
    switch (sort) {
      case "newest": list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case "low":    list.sort((a,b) => price(a) - price(b)); break;
      case "high":   list.sort((a,b) => price(b) - price(a)); break;
      case "name":   list.sort((a,b) => String(a.name||"").localeCompare(String(b.name||""))); break;
      default: list.sort((a,b) => {
        const r = Number(b.rating||0) - Number(a.rating||0);
        return r !== 0 ? r : Number(b.numReviews||0) - Number(a.numReviews||0);
      });
    }
    return list;
  }, [products, search, selBrand, selCat, selGender, selColor, selSize, priceMax, sort, isSale]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const paged      = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  const pageNums = () => {
    if (totalPages <= 5) return Array.from({length: totalPages}, (_, i) => i + 1);
    const p = [];
    p.push(1);
    if (page > 3) p.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) p.push(i);
    if (page < totalPages - 2) p.push("…");
    p.push(totalPages);
    return p;
  };

  const activeFilterLabels = [];
  if (selBrand !== "all") activeFilterLabels.push(formatFilterLabel(selBrand));
  if (selGender !== "all") activeFilterLabels.push(label(selGender));
  if (selCat !== "all") activeFilterLabels.push(label(selCat));
  if (isSale) activeFilterLabels.push("Sale");

  const catLabel = activeFilterLabels.length > 0 ? activeFilterLabels.join(" / ") : "All Shoes";

  const buildShopQuery = (overrides = {}) => {
    const query = new URLSearchParams();
    const brand    = overrides.brand    ?? selBrand;
    const gender   = overrides.gender   ?? selGender;
    const category = overrides.category ?? selCat;
    const sale     = overrides.sale     ?? isSale;
    if (sale) query.set("sale", "true");
    if (brand !== "all") query.set("brand", brand);
    if (gender !== "all") query.set("gender", gender);
    if (category !== "all") query.set("category", category);
    return query;
  };

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
  ];
  if (selBrand !== "all") breadcrumbItems.push({ label: formatFilterLabel(selBrand), to: `/shop?${buildShopQuery({ gender: "all", category: "all" }).toString()}` });
  if (selGender !== "all") breadcrumbItems.push({ label: label(selGender), to: `/shop?${buildShopQuery({ category: "all" }).toString()}` });
  if (selCat !== "all") breadcrumbItems.push({ label: label(selCat), to: `/shop?${buildShopQuery().toString()}` });

  if (loading && products.length === 0) return <Loader fullScreen />;

  if (error)
    return (
      <section className="min-h-screen bg-[#080808] px-4 pt-28">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#4a2d2d] bg-gradient-to-r from-[#2e1a1a] to-[#0e0e0e] p-6 text-center">
          <p className="text-[#e57373] uppercase tracking-[0.15em] text-[10px] font-semibold mb-2">Error</p>
          <p className="text-[11px] text-[#8b7070]">{error}</p>
        </div>
      </section>
    );

  if (products.length === 0)
    return (
      <>
        <section className="min-h-screen bg-[#080808] px-4 pt-28">
          <div className="mx-auto max-w-7xl rounded-2xl border border-[#1e1e1e] bg-[#0e0e0e] px-6 py-20 text-center">
            <h2 className="text-2xl font-bold text-[#ddd4be]">No Products Found</h2>
          </div>
        </section>
        <Footer/>
      </>
    );

  return (
    <>
      <section className="min-h-screen bg-[#080808] pt-20 sm:pt-28">
        {/* ── mobile top bar (sticky) ── */}
        <div className="sticky top-0 z-40 sm:hidden bg-[#080808]/95 backdrop-blur border-b border-[#1e1e1e] px-4 py-3 flex items-center gap-2.5">
          {/* filter button */}
          <button
            type="button"
            onClick={() => setShowSidebar(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[#1e1e1e] bg-[#0e0e0e] px-3 py-2 text-[#6b6666] hover:border-[#d4a544]/50 hover:text-[#d4a544] transition-all shrink-0"
          >
            <SlidersHorizontal size={14}/>
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">Filter</span>
          </button>

          {/* search — takes remaining width */}
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a5a] pointer-events-none"/>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-xl border border-[#1e1e1e] bg-[#0e0e0e] py-2 pl-8 pr-3 text-sm text-[#ddd4be] outline-none focus:border-[#d4a544]/50 placeholder:text-[#5a5a5a]"
            />
          </div>

          {/* sort — compact select */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="rounded-xl border border-[#1e1e1e] bg-[#0e0e0e] px-2 py-2 text-[11px] font-semibold text-[#ddd4be] outline-none focus:border-[#d4a544]/50 cursor-pointer shrink-0 max-w-[90px]"
          >
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4 sm:pt-6">

          {/* breadcrumb — hidden on tiny screens to save space */}
          <nav className="hidden sm:flex mb-5 items-center gap-1.5 flex-wrap text-[#5a5a5a]">
            {breadcrumbItems.map((item, index) => (
              <span key={item.label} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight size={11} />}
                {index === breadcrumbItems.length - 1 ? (
                  <span className="text-[11px] text-[#ddd4be]">{item.label}</span>
                ) : (
                  <Link to={item.to} className="text-[11px] hover:text-[#d4a544] transition">{item.label}</Link>
                )}
              </span>
            ))}
          </nav>

          <div className="flex lg:gap-10 gap-6">

            {/* ── SIDEBAR (desktop only inline) ── */}
            <aside className="hidden lg:block shrink-0 w-[280px] self-start sticky top-28">
              <div className="rounded-2xl border border-[#1e1e1e] bg-[#0e0e0e] p-5">
                <Sidebar
                  categoryOptions={catOptions}
                  brandOptions={brandOptions}
                  shoeSizes={sizeOptions}
                  selectedCategory={selCat}   setSelectedCategory={setSelCat}
                  selectedBrand={selBrand}     setSelectedBrand={setSelBrand}
                  selectedSize={selSize}       setSelectedSize={setSelSize}
                  selectedStyle={selStyle}     setSelectedStyle={setSelStyle}
                  priceMin={0} priceMax={priceMax} setPriceMax={setPriceMax} maxPrice={maxPrice}
                  onApply={()=>{}}
                  onClose={()=>setShowSidebar(false)}
                />
              </div>
            </aside>

            {/* ── RIGHT CONTENT ── */}
            <div className="flex-1 min-w-0">

              {/* desktop toolbar */}
              <div className="hidden sm:flex mb-5 items-center justify-between gap-4">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h1 className="text-xl font-extrabold text-[#ddd4be]">{catLabel}</h1>
                  <p className="text-[10px] text-[#5a5a5a] uppercase tracking-[0.12em]">
                    {filtered.length === 0 ? "0" : `${(page-1)*PRODUCTS_PER_PAGE+1}–${Math.min(page*PRODUCTS_PER_PAGE, filtered.length)}`} of {filtered.length}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button type="button" onClick={()=>setShowSidebar(c=>!c)}
                    className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-[#1e1e1e] px-3 py-2 text-[#6b6666] hover:border-[#d4a544]/50 hover:text-[#d4a544] transition-all">
                    <SlidersHorizontal size={13}/>
                  </button>
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a5a] pointer-events-none"/>
                    <input type="search" value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search products…"
                      className="rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] py-2 pl-9 pr-4 text-sm text-[#ddd4be] outline-none focus:border-[#d4a544]/50 placeholder:text-[#5a5a5a] w-44"/>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#5a5a5a] uppercase tracking-[0.12em] whitespace-nowrap">Sort:</span>
                    <select value={sort} onChange={e => setSort(e.target.value)}
                      className="rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] px-3 py-2 text-sm font-semibold text-[#ddd4be] outline-none focus:border-[#d4a544]/50 cursor-pointer">
                      <option value="popular">Most Popular</option>
                      <option value="newest">Newest</option>
                      <option value="low">Price: Low → High</option>
                      <option value="high">Price: High → Low</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* mobile page title + result count */}
              <div className="sm:hidden mb-4 flex items-baseline justify-between">
                <h1 className="text-lg font-extrabold text-[#ddd4be]">{catLabel}</h1>
                <span className="text-[10px] text-[#5a5a5a] uppercase tracking-[0.1em]">
                  {filtered.length} items
                </span>
              </div>

              {loading && (
                <div className="flex h-60 items-center justify-center">
                  <Loader2 size={28} className="animate-spin text-[#d4a544]"/>
                </div>
              )}

              {!loading && !error && filtered.length === 0 && (
                <div className="rounded-2xl border border-[#1e1e1e] bg-[#0e0e0e] px-6 py-16 text-center">
                  <h2 className="text-lg font-bold text-[#ddd4be]">No Products Found</h2>
                  <p className="mt-2 text-sm text-[#5a5a5a]">Try adjusting your filters.</p>
                </div>
              )}

              {!loading && !error && paged.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {paged.map(p => (
                    <div key={p._id || p.id} className="flex">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              )}

              {/* pagination */}
              {!loading && filtered.length > PRODUCTS_PER_PAGE && (
                <div className="mt-8 flex items-center justify-between border-t border-[#1e1e1e] pt-5 gap-2">
                  <button
                    type="button"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#1e1e1e] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b6666] disabled:opacity-30 hover:border-[#d4a544]/50 hover:text-[#d4a544] transition-all"
                  >
                    <ChevronLeft size={12}/><span className="hidden sm:inline">Prev</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {pageNums().map((n, i) =>
                      n === "…"
                        ? <span key={`e${i}`} className="px-1 text-xs text-[#5a5a5a]">…</span>
                        : <button
                            key={n}
                            type="button"
                            onClick={() => setPage(n)}
                            className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all duration-300
                              ${page === n ? "bg-[#d4a544] text-[#080808]" : "text-[#6b6666] hover:bg-[#0e0e0e] hover:text-[#d4a544]"}`}
                          >
                            {n}
                          </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#1e1e1e] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b6666] disabled:opacity-30 hover:border-[#d4a544]/50 hover:text-[#d4a544] transition-all"
                  >
                    <span className="hidden sm:inline">Next</span><ChevronRight size={12}/>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer/>

      {/* ── mobile + tablet drawer ── */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <button
              type="button"
              aria-label="close"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowSidebar(false)}
            />
            <motion.aside
              initial={{x:"-100%"}} animate={{x:0}} exit={{x:"-100%"}}
              transition={{type:"spring", damping:28, stiffness:220}}
              className="absolute left-0 top-0 h-full w-[88%] max-w-[300px] overflow-y-auto bg-[#0e0e0e] p-5 shadow-2xl border-r border-[#1e1e1e]"
            >
              <Sidebar
                categoryOptions={catOptions}
                brandOptions={brandOptions}
                shoeSizes={sizeOptions}
                selectedCategory={selCat}   setSelectedCategory={setSelCat}
                selectedBrand={selBrand}     setSelectedBrand={setSelBrand}
                selectedSize={selSize}       setSelectedSize={setSelSize}
                selectedStyle={selStyle}     setSelectedStyle={setSelStyle}
                priceMin={0} priceMax={priceMax} setPriceMax={setPriceMax} maxPrice={maxPrice}
                onApply={() => setShowSidebar(false)}
                onClose={() => setShowSidebar(false)}
              />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}