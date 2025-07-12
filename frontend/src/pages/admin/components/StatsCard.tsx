import { Card, CardContent } from "@/components/ui/card";

type StatsCardProps = {
	icon: React.ElementType;
	label: string;
	value: string;
	bgColor: string;
	iconColor: string;
};

const StatsCard = ({ bgColor, icon: Icon, iconColor, label, value }: StatsCardProps) => {
	return (
		<Card className='bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border-none shadow-lg rounded-xl hover:scale-[1.03] hover:shadow-2xl transition-transform duration-200'>
			<CardContent className='p-6'>
				<div className='flex items-center gap-5'>
					<div className={`p-4 rounded-full shadow-md ${bgColor} flex items-center justify-center`}>
						<Icon className={`size-8 ${iconColor}`} />
					</div>
					<div>
						<p className='text-base text-zinc-400 font-semibold'>{label}</p>
						<p className='text-3xl font-extrabold tracking-tight text-white'>{value}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
export default StatsCard;