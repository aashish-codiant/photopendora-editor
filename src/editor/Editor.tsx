import React, { useEffect, useState } from 'react';
import { CanvasStage } from './components/CanvasStage';
import { EditorToolbar } from './components/EditorToolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import LayersPanel from './components/LayersPanel';
import AssetLibrary from './components/AssetLibrary';
import FontPanel from './components/FontPanel';
import { Layers, Library, Settings2, Type, Loader2, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { useEditorStore } from './store/editorStore';
import { loadProductTemplate } from './services/templateService';
import { autoSaveDesign } from './utils/autoSave';

export const Editor: React.FC = () => {
    const [leftTab, setLeftTab] = useState<'layers' | 'assets'>('layers');
    const [rightTab, setRightTab] = useState<'properties' | 'fonts'>('properties');
    const [searchParams] = useSearchParams();
    const platform = searchParams.get('platform');
    const shop = searchParams.get('shop');
    const productId = searchParams.get('productId');
    const variantId = searchParams.get('variantId');
    const quantity = searchParams.get('quantity');

    const { template, setTemplate, setDesignId, designId, elements } = useEditorStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (designId && elements.length > 0) {
            autoSaveDesign(designId, elements);
        }
    }, [elements, designId]);

    useEffect(() => {
        const initEditor = async () => {
            if (!productId) {
                setError("No product ID specified in URL. Try ?productId=necklace_01");
                setLoading(false);
                return;
            }

            try {
                const tpl = await loadProductTemplate(productId, variantId);
                if (tpl) {
                    setTemplate(tpl);
                    setDesignId(`design_${Math.random().toString(36).substr(2, 9)}`);
                } else {
                    setError("Product template not found.");
                }
            } catch (err) {
                setError("Failed to load product template.");
            } finally {
                setLoading(false);
            }
        };

        initEditor();
    }, [productId, setTemplate, setDesignId]);

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
                platform:- {platform}<br />
                {platform === "shopify" && (
                    <div className='border border-purple-400 bg-purple-50 p-4 my-4 rounded-lg'>
                        <p>platform:- {platform}</p>
                        <p>shop:- {shop}</p>
                        <p>productId:- {productId}</p>
                        <p>variantId:- {variantId}</p>
                        <p>quantity:- {quantity}</p>
                    </div>
                )}
                {platform == "etsy" && (
                    <div className='border border-purple-400 bg-purple-50 p-4 my-4 rounded-lg'>
                        <p>platform:- {platform}</p>
                        <p>shop:- {shop}</p>
                        <p>listingId:- {productId}</p>
                    </div>
                )}
                <div className="flex gap-4">
                    <a href="/" className="px-6 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-all font-medium">Go Home</a>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all font-medium">Retry</button>
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
                    <button
                        onClick={() => setLeftTab('assets')}
                        className={`p-3 rounded-xl transition-all ${leftTab === 'assets' ? 'bg-indigo-600 text-white shadow-indigo-500/50 shadow-lg scale-110' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        title="Asset Library"
                    >
                        <Library size={22} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={() => setLeftTab('assets')}
                        className={`p-3 rounded-xl transition-all ${leftTab === 'assets' ? 'bg-indigo-600 text-white shadow-indigo-500/50 shadow-lg scale-110' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        title="Asset Library"
                    >
                        <Library size={22} strokeWidth={2.5} />
                    </button>
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
