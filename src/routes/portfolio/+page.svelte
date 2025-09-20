<script lang="ts">
	import { Meta, Section, Heading, BlueLine } from "$lib/components";
	import ProjectCard from "./ProjectCard.svelte";
	import PublicationCard from "./PublicationCard.svelte";
	import EventCard from "./EventCard.svelte";
	import ExperienceCard from "./ExperienceCard.svelte";
	import Tag from "./Tag.svelte";
</script>

<Meta title="Portfolio" description="Egor Ternovoi's Portfolio" />

<Section>
	<div class="text-center">
		<Heading level={1}>Portfolio</Heading>
	</div>

	<Section>
		<div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4">
			<div class="text-lg font-semibold text-center sm:text-left">Egor Ternovoi</div>

			<div class="text-sm text-zinc-600 text-center sm:text-right mt-2 sm:mt-0">
				+995 591 911 039 | <a href="mailto:cofob@riseup.net" class="text-blue-500">cofob@riseup.net</a> | Tbilisi, Georgia
			</div>
		</div>

		<div class="mt-4 flex flex-wrap justify-between items-center">
			<div class="flex flex-wrap gap-2">
				<Tag>Python</Tag>
				<Tag>Virtualization</Tag>
				<Tag>Rust</Tag>
				<Tag>CI/CD</Tag>
				<Tag>Networking</Tag>
				<Tag>Linux</Tag>
				<Tag>Nginx</Tag>
			</div>
			<div class="flex gap-4 mt-3 sm:mt-0">
				<a href="https://t.me/cofob" target="_blank" class="link">Telegram</a>
				<a href="https://github.com/cofob" target="_blank" class="link">GitHub</a>
				<a href="https://www.linkedin.com/in/egor-ternovoi-702547316/" target="_blank" class="link">LinkedIn</a>
			</div>
		</div>
	</Section>

	<Section>
		<div class="text-center mt-8">
			<Heading level={3}>About Me</Heading>
		</div>
		<div class="mt-2 text-center text-lg text-zinc-600">
			<p>
				I'm a Python <BlueLine><b>developer</b></BlueLine> and <BlueLine><b>DevOps</b></BlueLine> engineer with expertise in virtualization, 
				networking, and system architecture. With a passion for open-source and functional programming, 
				I focus on building reliable, scalable infrastructure and elegant technical solutions. 
				Currently working as a Senior Python Developer while continuing to explore new technologies.
			</p>
		</div>
	</Section>

	<Section>
		<div class="text-center mt-8">
			<Heading level={3}>Projects</Heading>
		</div>
		<div class="mt-2 text-center text-lg text-zinc-600">
			<p>
				Explore some of my personal projects, contributions, and tools that I've developed using various technologies
				and platforms.
			</p>
		</div>

		<div 
			class="mt-4 mb-4 border-2 rounded-lg p-4 border-sky-300 bg-sky-50 featured-card transition-all duration-300"
		>
			<div class="font-semibold text-lg mb-2">
				Featured: <BlueLine>Fastside</BlueLine>
			</div>
			<div class="mb-2">
				A fast smart redirecting gateway for frontend services, built with Rust. 
				Fastside provides links for various open-source services for reliable access.
				<div class="mt-2">
					<div class="flex flex-wrap gap-2 mb-2">
						<Tag bg="bg-white" border="border border-sky-200">Rust</Tag>
						<Tag bg="bg-white" border="border border-sky-200">Open-source</Tag>
						<Tag bg="bg-white" border="border border-sky-200">Self-hosted</Tag>
					</div>
					<div class="flex gap-4 mt-2">
						<a href="https://github.com/cofob/fastside" target="_blank" class="link">Source Code</a>
						<a href="https://fastsi.de" target="_blank" class="link">View Website</a>
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
			<ProjectCard source="https://github.com/cofob/autogenlib" name="AutoGenLib">
				A Python library that automatically generates code on-the-fly when you import the module using OpenAI's API.
			</ProjectCard>
			<ProjectCard source="https://github.com/nix-community/mineflake" name="Mineflake">
				A tool for declaratively managing Minecraft server setups, written in Rust and Nix.
			</ProjectCard>
			<ProjectCard source="https://github.com/cofob/cofob.dev" name="This Site">
				A personal portfolio site built with SvelteKit and TailwindCSS to showcase my projects and achievements.
			</ProjectCard>
			<ProjectCard source="https://github.com/fire-square" name="firesquare.ru">
				A Minecraft server with a rich history, featuring custom deployments through NixOS (via Mineflake) and
				self-developed plugins. I worked on this for 2 years.
			</ProjectCard>
			<ProjectCard source="https://github.com/cofob/AlfisViewer/" name="AlfisViewer">
				A blockchain observer for the Alfis network, built on Django. <a
					href="https://viewer.alfis.name"
					class="link"
					target="_blank">View website.</a
				>
			</ProjectCard>
			<ProjectCard source="https://github.com/cofob/DiscordRPC" name="DiscordRPC">
				A Python program for displaying custom Discord Rich Presence statuses.
			</ProjectCard>
			<ProjectCard source="https://github.com/cofob/Emercoin.py" name="Emercoin.py">
				A Python API for interacting with the Emercoin blockchain.
			</ProjectCard>
			<ProjectCard source="https://github.com/cofob/EmerVPN" name="EmerVPN">
				A proof-of-concept implementation of anonymous, full-mesh WireGuard VPN peering on the Emercoin blockchain.
			</ProjectCard>
			<div class="rounded-lg border-2">
				<div class="m-2 mx-3">
					Discover more projects on my <a href="https://github.com/cofob/" class="link" target="_blank">GitHub</a>.
				</div>
			</div>
		</div>
	</Section>

	<Section>
		<div class="text-center mt-8">
			<Heading level={3}>Experience</Heading>
		</div>
		<div class="mt-2 text-center text-lg text-zinc-600">
			<p>My professional experience spans across various roles, contributing to multiple projects and companies.</p>
		</div>

		<div class="mt-4">
			<ExperienceCard company="NDA company" location="Tbilisi, Georgia" title="Senior Python Developer" date="05/2025 - Present">
				Currently working as a Senior Python Developer on confidential projects. Details covered under NDA.
			</ExperienceCard>
			<ExperienceCard company="Hosting provider" location="Remote, Tbilisi" title="DevOps Engineer" date="08/2024 - 04/2025">
				As a DevOps Engineer, I was responsible for the back-end infrastructure supporting the billing system. Key
				accomplishments:
				<ul class="list-inside list-disc">
					<li>
						Enhanced system stability through redundancy and traffic balancing, moving away from unstable Docker Swarm.
					</li>
					<li>Transitioned all systems to declarative configurations for consistency and maintainability.</li>
					<li>Implemented alerting and monitoring systems to improve response times and system health.</li>
				</ul>
			</ExperienceCard>
			<ExperienceCard company="Hosting provider" location="Remote, Tbilisi" title="Python Developer" date="05/2023 - 04/2025">
				Led a small Python development team, focusing on critical projects for the hosting provider:
				<ul class="list-inside list-disc">
					<li>Manager for over 100,000 virtual machines with an internal system built as an alternative to OpenStack.</li>
					<li>
						Developed a unique VPN service to bypass geo-blocks in Russia using a custom DNS-based traffic balancing
						mechanism.
					</li>
					<li>Implemented a robust service uptime monitoring system.</li>
					<li>Responsible for interviewing and onboarding new team members.</li>
				</ul>
			</ExperienceCard>
			<ExperienceCard company="Hosting provider" location="Remote, Russia" title="Technical Support" date="01/2023 - 05/2023">
				Worked in the technical support department, leveraging deep server knowledge and strong communication skills:
				<ul class="list-inside list-disc">
					<li>Developed department best practices and authored documentation.</li>
					<li>Awarded Employee of the Month twice for exceptional performance.</li>
					<li>Handled complex technical issues on multiple support lines, offering solutions under pressure.</li>
				</ul>
			</ExperienceCard>
			<ExperienceCard company="Freelance" location="Remote, Russia" title="Python Developer" date="09/2022 - 01/2023">
				Collaborated with diverse clients on various projects, including writing backend systems and bots:
				<ul class="list-inside list-disc">
					<li>Developed a web3 social network backend in just two weeks using FastAPI, Blockchain, and IPFS.</li>
				</ul>
			</ExperienceCard>
		</div>
	</Section>

	<Section>
		<div class="text-center mt-8">
			<Heading level={3}>Publications</Heading>
		</div>
		<div class="mt-2 text-center text-lg text-zinc-600">
			<p>Here are some of my recent articles and blog posts.</p>
		</div>

		<ul class="list-disc ml-6 mt-4">
			<li>
				<PublicationCard
					url="https://habr.com/ru/companies/aeza/articles/804499/"
					name="A Radical Defense of Self-Hosting: Level – Hardware and Hardcore"
					meta="Source: Habr | Date: April 1, 2024"
				>
					An April Fool's Day post detailing how my friend and I secured a server against physical and cyber threats,
					using extreme and humorous measures.
				</PublicationCard>
			</li>
		</ul>
	</Section>

	<Section>
		<div class="text-center mt-8">
			<Heading level={3}>Events</Heading>
		</div>
		<div class="mt-2 text-center text-lg text-zinc-600">
			<p>Below are events that I've organized in Tbilisi, Georgia.</p>
		</div>

		<ul class="list-disc ml-6 mt-4">
			<EventCard
				source="https://t.me/F0RTHSP4CE/461"
				name="Fine-tuning LMs - from idea to prod"
				meta="Location: F0RTHSP4CE, Ana Kalandadze 5 | Date: September 19, 2025 | Role: Speaker"
			>
				Practical guide on fine-tuning specialized small language models to achieve 99% performance.
			</EventCard>
			<EventCard
				source="https://t.me/f0rthsp4ce/408"
				name="Fprog Tbilisi Meetup"
				meta="Location: F0RTHSP4CE, Ana Kalandadze 5 | Date: December 1, 2024 | Role: Organizer"
			>
				A series of workshops and talks covering topics like formal verification in Lean4, optimizations in Common Lisp,
				and metaprogramming in Lisp, followed by discussions and hands-on sessions.
			</EventCard>
			<EventCard
				source="https://t.me/f0rthsp4ce/405"
				name="What is Nix?"
				meta="Location: F0RTHSP4CE, Ana Kalandadze 5 | Date: October 17, 2024 | Role: Organizer"
			>
				An introduction to Nix, Nixpkgs, and NixOS, comparing them to Docker and exploring functional programming in
				Nix.
			</EventCard>
			<EventCard
				source="https://t.me/f0rthsp4ce/373"
				name="Tbilisi Guix Meetup #1"
				meta="Location: F0RTHSP4CE, Khorava 18 | Date: June 1, 2024 | Role: Organizer"
			>
				Three insightful talks: 1) Overview of GNU Guix and its comparison with other Linux distros. 2) Hacking any
				project in Guix in 3 seconds. 3) Interactive development with Guile Scheme. Followed by Q&A and a hands-on
				session.
			</EventCard>
		</ul>
	</Section>
</Section>

<style>
  .featured-card {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .featured-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #7dd3fc;
  }
</style>
