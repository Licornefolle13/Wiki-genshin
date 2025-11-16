import type { Weapon } from '../types';
import { X } from 'lucide-react';

type Props = {
    weapon: Weapon;
    onClose: () => void;
};

export default function WeaponModal({ weapon, onClose }: Props) {
    const sanitizeForFilename = (name: string) =>
        name
            .replace(/[^\w\s'\-]/g, '')
            .replace(/\s+/g, '_');

    const imgSrc =
        weapon.image_url && weapon.image_url !== ''
            ? weapon.image_url
            : `/images/weapons/Weapon_${sanitizeForFilename(weapon.name)}.png`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
        >
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            <div className="relative w-full max-w-3xl mx-4 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                <div className="flex justify-end p-3">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md hover:bg-slate-700 text-slate-200"
                        aria-label="Close"
                    >
                        <X />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    <div className="col-span-1 flex items-center justify-center">
                        <div className="w-full h-72 bg-slate-700 rounded-lg overflow-hidden flex items-center justify-center">
                            {imgSrc ? (
                                <img src={imgSrc} alt={weapon.name} className="object-contain h-full w-full" />
                            ) : (
                                <div className="text-slate-400">No image</div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2 text-slate-200">
                        <h2 className="text-2xl font-bold mb-2">{weapon.name}</h2>
                        <div className="flex items-center gap-4 mb-3 text-sm text-slate-300">
                            <div>
                                <span className="font-medium text-amber-400">Type:</span> {weapon.type}
                            </div>
                            <div>
                                <span className="font-medium text-amber-400">Rarity:</span> {weapon.rarity}★
                            </div>
                            <div>
                                <span className="font-medium text-amber-400">Base ATK:</span> {weapon.base_attack}
                            </div>
                        </div>

                        {weapon.secondary_stat && (
                            <p className="text-slate-300 mb-2">
                                <span className="font-medium text-amber-400">Secondary:</span> {weapon.secondary_stat}
                            </p>
                        )}

                        {weapon.description && (
                            <div className="prose prose-invert prose-sm text-slate-300">
                                <p>{weapon.description}</p>
                            </div>
                        )}

                        {/* Additional placeholder area for passive/abilities if present */}
                        {('passive' in weapon || 'ability' in weapon) && (
                            <div className="mt-4 text-slate-300">
                                {/* If your API supplies passive/ability fields, render them here */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
