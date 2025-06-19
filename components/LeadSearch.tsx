"use client"

import { useState, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, User, ExternalLink, Building2 } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

interface Lead {
  id: number;
  name: string;
  user_id: [number, string] | null;
  partner_id: [number, string] | null;
}

interface SearchResult {
  success: boolean;
  data: Lead[];
}

export default function LeadSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchLeads = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    try {
      const domain = JSON.stringify([
    "|",
    ["name", "ilike", query.trim()],
    ["partner_id.name", "ilike", query.trim()]
  ]);
      const fields = JSON.stringify(["id","name","user_id","partner_id"]);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crm.lead?domain=${encodeURIComponent(domain)}&fields=${encodeURIComponent(fields)}&limit=20`);
      const result: SearchResult = await response.json();
      
      if (result.success) {
        setSearchResults(result.data);
      } else {
        setSearchResults([]);
      }
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching leads:', error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchLeads(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Auto-search after 500ms delay
    if (value.trim()) {
      const timeoutId = setTimeout(() => {
        searchLeads(value);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <Image
          src="https://erpsamuiaksorn.com/web/binary/company_logo"
          alt="Company Logo"
          width={150}
          height={35}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">ค้นหาใบสั่งงาน</h1>
        <p className="text-gray-600">ใส่ชื่องานหรือคำค้นหาเพื่อค้นหาใบสั่งงาน</p>
      </div>

      {/* Search Form */}
      <Card className="p-6 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="ใส่ชื่องาน เช่น นามบัตร, โบรชัวร์, ใบปลิว..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              disabled={isSearching}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                กำลังค้นหา...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                ค้นหา
              </div>
            )}
          </Button>
        </form>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ผลการค้นหา {searchQuery && (
              <>
                &ldquo;{searchQuery}&rdquo;
              </>
            )}
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{lead.name}</h3>
                      <div className="space-y-1">
                        {lead.partner_id && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building2 className="w-4 h-4" />
                            <span>ลูกค้า: {lead.partner_id[1]}</span>
                          </div>
                        )}
                        {lead.user_id && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>ผู้รับผิดชอบ: {lead.user_id[1]}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        ID: {lead.id}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/?id=${lead.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <ExternalLink className="w-4 h-4" />
                          ดูรายละเอียด
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">ไม่พบงานที่ตรงกับการค้นหา</div>
              <div className="text-sm text-gray-400">ลองใช้คำค้นหาอื่น หรือตรวจสอบการสะกดคำ</div>
            </div>
          )}
        </Card>
      )}

      {/* Instructions */}
      {!hasSearched && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">วิธีใช้งาน</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• ใส่ชื่องานหรือคำค้นหาในช่องด้านบน</li>
            <li>• ระบบจะค้นหาอัตโนมัติขณะที่คุณพิมพ์</li>
            <li>• คลิก &ldquo;ดูรายละเอียด&rdquo; เพื่อเปิดใบสั่งงาน</li>
            <li>• สามารถค้นหาด้วยชื่องาน เลขที่งาน หรือคำสำคัญได้</li>
          </ul>
        </Card>
      )}
    </div>
  );
}