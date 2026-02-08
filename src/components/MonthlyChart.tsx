"use client";

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Transaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface MonthlyChartProps {
    transactions: Transaction[];
}

export default function MonthlyChart({ transactions }: MonthlyChartProps) {
    const data = useMemo(() => {
        const monthlyData: Record<string, { name: string; Income: number; Expense: number }> = {};
        
        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
            monthlyData[key] = { name: key, Income: 0, Expense: 0 };
        }

        transactions.forEach(t => {
            const date = new Date(t.date);
            const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            
            if (monthlyData[key]) {
                if (t.type === 'income') {
                    monthlyData[key].Income += t.amount;
                } else {
                    monthlyData[key].Expense += t.amount;
                }
            }
        });

        return Object.values(monthlyData);
    }, [transactions]);

    return (
        <div className="bg-card p-4 rounded-2xl shadow-sm border border-border">
            <h3 className="text-lg font-bold mb-4 text-foreground">Financial Summary</h3>
            <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10 }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10 }}
                            tickFormatter={(value) => `Rp ${value/1000}k`}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                borderRadius: '12px', 
                                border: '1px solid var(--color-border)', 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                backgroundColor: 'var(--color-popover)',
                                color: 'var(--color-popover-foreground)'
                            }}
                            formatter={(value: any) => [formatCurrency(Number(value)), "Amount"]}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar 
                            dataKey="Income" 
                            fill="var(--color-primary)" 
                            radius={[4, 4, 0, 0]} 
                            barSize={12}
                        />
                        <Bar 
                            dataKey="Expense" 
                            fill="var(--color-destructive)" 
                            radius={[4, 4, 0, 0]} 
                            barSize={12}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
