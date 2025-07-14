import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";

const MainLayout = () => {
	const [screenSize, setScreenSize] = useState({
		isMobile: false,
		isTablet: false,
		isDesktop: false
	});

	useEffect(() => {
		const checkScreenSize = () => {
			const width = window.innerWidth;
			setScreenSize({
				isMobile: width < 768,
				isTablet: width >= 768 && width < 1024,
				isDesktop: width >= 1024
			});
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);
		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	const { isMobile, isTablet } = screenSize;

	return (
		<div className='h-screen bg-black text-white flex flex-col overflow-hidden'>
			<ResizablePanelGroup 
				direction='horizontal' 
				className={`flex-1 flex h-full overflow-hidden ${isMobile ? 'p-1' : 'p-2'}`}
			>
				<AudioPlayer />
				{/* left sidebar */}
				<ResizablePanel 
					defaultSize={isMobile ? 15 : isTablet ? 18 : 20} 
					minSize={isMobile ? 12 : 10} 
					maxSize={isMobile ? 20 : 30}
					collapsible={isMobile}
				>
					<LeftSidebar />
				</ResizablePanel>

				<ResizableHandle className={`${isMobile ? 'w-1' : 'w-2'} bg-black rounded-lg transition-colors`} />

				{/* Main content */}
				<ResizablePanel defaultSize={isMobile ? 85 : isTablet ? 82 : 60}>
					<Outlet />
				</ResizablePanel>

				{!isMobile && !isTablet && (
					<>
						<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

						{/* right sidebar */}
						<ResizablePanel defaultSize={20} minSize={15} maxSize={25} collapsedSize={0}>
							<FriendsActivity />
						</ResizablePanel>
					</>
				)}
			</ResizablePanelGroup>

			<PlaybackControls />
		</div>
	);
};
export default MainLayout;