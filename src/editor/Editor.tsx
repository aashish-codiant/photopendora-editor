import React, { useEffect, useState } from 'react';
import { CanvasStage } from './components/CanvasStage';
import { EditorToolbar } from './components/EditorToolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import LayersPanel from './components/LayersPanel';
import AssetLibrary from './components/AssetLibrary';
import FontPanel from './components/FontPanel';
import { Layers, Library, Settings2, Type, Loader2, AlertCircle } from 'lucide-react';
import { useSearchParams, useParams, useNavigate } from 'react-router';
import { useEditorStore } from './store/editorStore';
import { loadProductTemplate, loadDesign } from './services/templateService';
import { autoSaveDesign } from './utils/autoSave';

export const Editor: React.FC<{ mode?: 'create' | 'edit' | 'customize' }> = ({ mode = 'customize' }) => {
    const [leftTab, setLeftTab] = useState<'layers' | 'assets'>('layers');
    const [rightTab, setRightTab] = useState<'properties' | 'fonts'>('properties');
    const [searchParams] = useSearchParams();
    const { id: designIdFromParams } = useParams();
    const navigate = useNavigate();
    
    // Shopify/Etsy params
    const platform = searchParams.get('platform');
    const shop = searchParams.get('shop');
    const productId = searchParams.get('productId');
    const variantId = searchParams.get('variantId');
    const quantity = searchParams.get('quantity');

    const { 
        template, 
        setTemplate, 
        setDesignId, 
        designId, 
        elements, 
        setElements,
        isPersonalizationMode,
        setPersonalizationMode 
    } = useEditorStore();
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [availableProducts, setAvailableProducts] = useState<any[]>([]);

    // Initial check for personalization mode
    useEffect(() => {
        let isPersonalization = false;
        if (mode === 'customize') {
            isPersonalization = !!(productId && (platform === 'shopify.com' || platform === 'etsy.com'));
        }
        
        setPersonalizationMode(isPersonalization, {
            platform, shop, productId, variantId, quantity
        });
    }, [productId, platform, shop, variantId, quantity, setPersonalizationMode, mode]);

    useEffect(() => {
        if (designId && elements.length > 0) {
            autoSaveDesign(designId, elements);
        }
    }, [elements, designId]);

    // Fetch and list products if needed
    useEffect(() => {
        if (mode === 'create' && !productId && !designIdFromParams) {
            const fetchProducts = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
                    const result = await response.json();
                    if (result.success) {
                        setAvailableProducts(result.data);
                    }
                } catch (err) {
                    console.error("Failed to fetch products:", err);
                }
            };
            fetchProducts();
        }
    }, [mode, productId, designIdFromParams]);

    useEffect(() => {
        const initEditor = async () => {
            setLoading(true);
            try {
                // Case 1: Edit Existing Design (ID present in URL)
                if (designIdFromParams && designIdFromParams !== 'create') {
                    const data = await loadDesign(designIdFromParams);
                    if (data) {
                        setDesignId(data.id);
                        setElements(data.elements || []);
                        if (data.productId) {
                            const tpl = await loadProductTemplate(data.productId, data.variantId);
                            if (tpl) setTemplate(tpl);
                        }
                    } else if (productId) {
                        const tpl = await loadProductTemplate(productId, variantId);
                        if (tpl) {
                            setTemplate(tpl);
                            setDesignId(designIdFromParams);
                            setElements([]); 
                        } else {
                            setError("Design/Product not found.");
                        }
                    } else {
                        setError("Design not found.");
                    }
                } 
                // Case 2: New Creative Design OR Personalization Mode (No ID in URL)
                else if (productId) {
                    const tpl = await loadProductTemplate(productId, variantId);
                    if (tpl) {
                        setTemplate(tpl);
                        const newId = `design_${Math.random().toString(36).substr(2, 9)}`;
                        setDesignId(newId);
                        setElements([]); 
                        // Update URL to include the new design ID
                        navigate(`/editor/${newId}?${searchParams.toString()}`, { replace: true });
                    } else {
                        setError("Product template not found.");
                    }
                }
                // Case 3: Create Mode (No design or product)
                else if (mode === 'create') {
                    // Do nothing here, allow availableProducts screen to show
                    setLoading(false);
                }
                // Case 4: Invalid access 
                else {
                    setError("No design or product specified. Please select a template first.");
                }
            } catch (err) {
                console.error("Initialization error:", err);
                setError("Failed to initialize editor.");
            } finally {
                if (mode !== 'create' || productId || designIdFromParams) {
                    setLoading(false);
                }
            }
        };

        initEditor();
    }, [designIdFromParams, productId, variantId, setTemplate, setDesignId, setElements, mode]);

    const handleProductSelect = (selectedProductId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('productId', selectedProductId);
        navigate(`/editor/create?${params.toString()}`);
    }

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 font-sans">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Loading Personalization System...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 px-4 text-center font-sans">
                <div className="bg-rose-50 p-4 rounded-full mb-4">
                    <AlertCircle className="h-10 w-10 text-rose-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Editor Error</h2>
                <p className="text-slate-600 mb-6">{error}</p>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-all font-medium">Go Home</button>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all font-medium">Retry</button>
                </div>
            </div>
        );
    }

    // Show Product selection screen if in Create mode and no product selected
    if (mode === 'create' && !productId && !template) {
        return (
            <div className="h-screen w-full flex flex-col bg-slate-50 font-sans overflow-y-auto">
                <div className="max-w-6xl mx-auto px-6 py-12 w-full">
                    <div className="flex flex-col gap-2 mb-10">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Select a Product Template</h1>
                        <p className="text-slate-500 font-medium">Choose a product to start creating your new design.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {availableProducts.length > 0 ? (
                            availableProducts.map((product) => (
                                <div key={product.id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 flex flex-col">
                                    <div className="h-56 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                                        {(product.featureImage || product.image) ? (
                                            <img src={product.featureImage || product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="text-6xl group-hover:scale-125 transition-transform duration-500 opacity-60">📦</div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{product.name}</h3>
                                            <p className="text-sm text-slate-500 font-medium">Personalizable Product</p>
                                        </div>
                                        <button 
                                            onClick={() => handleProductSelect(product.id)}
                                            className="cursor-pointer mt-auto w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-900 hover:shadow-lg transition-all duration-200 active:scale-95"
                                        >
                                            Start Design
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                                <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mb-4" />
                                <p className="text-slate-400 font-medium italic">Fetching available templates...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen w-full bg-slate-50 font-sans">
            {/* Top Toolbar */}
            <header className="h-16 border-b bg-white flex items-center px-6 justify-between shadow-sm shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white">
                        <Settings2 className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-slate-800 tracking-tight leading-none">PhotoPandora <span className="text-indigo-600 font-medium text-[10px] ml-1 px-1.5 py-0.5 bg-indigo-50 rounded-full border border-indigo-100 uppercase">Editor</span></h1>
                        {template && <p className="text-[10px] text-slate-400 font-medium mt-1">Product: <span className="text-slate-600 uppercase">{template.productId}</span></p>}
                    </div>
                </div>
                <EditorToolbar />
            </header>

            {/* Main Workspace */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Navigation & Primary Panels */}
                <aside className="w-16 border-r bg-slate-900 flex flex-col items-center py-6 gap-6 shrink-0 z-10 shadow-lg">
                    <button
                        onClick={() => setLeftTab('layers')}
                        className={`p-3 rounded-xl transition-all ${leftTab === 'layers' ? 'bg-indigo-600 text-white shadow-indigo-500/50 shadow-lg scale-110' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        title="Layers"
                    >
                        <Layers size={22} strokeWidth={2.5} />
                    </button>
                    {!isPersonalizationMode && (
                        <button
                            onClick={() => setLeftTab('assets')}
                            className={`p-3 rounded-xl transition-all ${leftTab === 'assets' ? 'bg-indigo-600 text-white shadow-indigo-500/50 shadow-lg scale-110' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                            title="Asset Library"
                        >
                            <Library size={22} strokeWidth={2.5} />
                        </button>
                    )}
                </aside>

                {/* Left Secondary Panel */}
                <aside className="w-72 border-r bg-white hidden md:block shrink-0 overflow-y-auto shadow-sm">
                    {leftTab === 'layers' ? <LayersPanel /> : <AssetLibrary />}
                </aside>

                {/* Canvas Area */}
                <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-slate-100 relative group">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />
                    <CanvasStage />
                </div>

                {/* Right Sidebar - Properties & Fonts */}
                <aside className="w-80 border-l bg-white hidden lg:flex flex-col shrink-0 shadow-sm">
                    <div className="flex border-b">
                        <button
                            onClick={() => setRightTab('properties')}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${rightTab === 'properties' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Settings2 size={14} />
                                Properties
                            </div>
                        </button>
                        <button
                            onClick={() => setRightTab('fonts')}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${rightTab === 'fonts' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Type size={14} />
                                Typography
                            </div>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {rightTab === 'properties' ? <PropertiesPanel /> : <FontPanel />}
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default Editor;
