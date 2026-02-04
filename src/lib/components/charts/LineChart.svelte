<script lang="ts">
	import { Chart, registerables } from 'chart.js';
	import { onMount } from 'svelte';

	Chart.register(...registerables);

	interface Props {
		data: {
			labels: string[];
			datasets: {
				label: string;
				data: number[];
				backgroundColor?: string;
				borderColor?: string;
				borderWidth?: number;
				tension?: number;
				fill?: boolean;
			}[];
		};
		options?: any; // Chart.js options
		class?: string;
	}

	let { data, options, class: className = '' }: Props = $props();

	let canvas: HTMLCanvasElement;
	let chartInstance: Chart | null = null;

	onMount(() => {
		if (canvas) {
			chartInstance = new Chart(canvas, {
				type: 'line',
				data: data,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							position: 'top'
						}
					},
					scales: {
						y: {
							beginAtZero: true
						}
					},
					...options
				}
			});
		}
	});

	// Update chart when data or options change
	$effect(() => {
		if (chartInstance) {
			chartInstance.data = data;
			chartInstance.options = {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'top'
					}
				},
				scales: {
					y: {
						beginAtZero: true
					}
				},
				...options
			};
			chartInstance.update();
		}
	});
</script>

<div class={`relative w-full h-80 ${className}`}>
	<canvas bind:this={canvas}></canvas>
</div>
