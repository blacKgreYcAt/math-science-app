// D3.js Bubble Chart Visualization

function createBubbleChart(data, onBubbleClick) {
    const container = document.getElementById('bubble-chart');
    container.innerHTML = ''; // Clear previous chart

    if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px;">無可用數據</p>';
        return;
    }

    // Chart dimensions
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select('#bubble-chart')
        .append('svg')
        .attr('width', container.clientWidth)
        .attr('height', container.clientHeight);

    // Create main group
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xMin = d3.min(data, d => d.change5d) - 1;
    const xMax = d3.max(data, d => d.change5d) + 1;
    const yMin = d3.min(data, d => d.change20d) - 1;
    const yMax = d3.max(data, d => d.change20d) + 1;

    const xScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([height, 0]);

    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => Math.abs(d.change20d))])
        .range([5, 50]);

    // Grid lines
    g.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .call(d3.axisLeft(yScale)
            .tickSize(-width)
            .tickFormat('')
        );

    g.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale)
            .tickSize(-height)
            .tickFormat('')
        );

    // X Axis
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('x', width / 2)
        .attr('y', 40)
        .attr('fill', '#6b7280')
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text('近5日表現 (%)');

    // Y Axis
    g.append('g')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .attr('fill', '#6b7280')
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text('近20日累計表現 (%)');

    // Center line (0,0)
    g.append('line')
        .attr('x1', xScale(0))
        .attr('x2', xScale(0))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#e5e7eb')
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.5);

    g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .attr('stroke', '#e5e7eb')
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0.5);

    // Create bubbles
    const bubbles = g.selectAll('.bubble')
        .data(data, d => d.id)
        .enter()
        .append('circle')
        .attr('class', d => `bubble status-${d.fundStatus.toLowerCase().replace(/\s+/g, '-')}`)
        .attr('cx', d => xScale(d.change5d))
        .attr('cy', d => yScale(d.change20d))
        .attr('r', d => radiusScale(Math.abs(d.change20d)))
        .attr('opacity', 0.8)
        .on('click', function(event, d) {
            d3.selectAll('.bubble').attr('opacity', 0.6);
            d3.select(this).attr('opacity', 1);
            onBubbleClick(d);
        })
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 1);

            // Show tooltip
            const tooltip = d3.select('body')
                .append('div')
                .attr('id', 'tooltip')
                .style('position', 'absolute')
                .style('background', '#1f2937')
                .style('color', 'white')
                .style('padding', '10px 15px')
                .style('border-radius', '8px')
                .style('font-size', '13px')
                .style('z-index', '1000')
                .style('pointer-events', 'none')
                .style('box-shadow', '0 4px 12px rgba(0,0,0,0.2)')
                .html(`
                    <strong>${d.sector}</strong><br/>
                    5日: ${d.change5d > 0 ? '+' : ''}${d.change5d.toFixed(2)}%<br/>
                    20日: ${d.change20d > 0 ? '+' : ''}${d.change20d.toFixed(2)}%<br/>
                    <span style="display: inline-block; margin-top: 6px; padding: 4px 8px; background: rgba(255,255,255,0.2); border-radius: 4px;">
                        ${d.fundStatus}
                    </span>
                `);

            tooltip
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 30) + 'px');
        })
        .on('mousemove', function(event) {
            d3.select('#tooltip')
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 30) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 0.8);

            d3.select('#tooltip').remove();
        });

    // Add labels to bubbles
    const labels = g.selectAll('.bubble-label')
        .data(data, d => d.id)
        .enter()
        .append('text')
        .attr('class', 'bubble-label')
        .attr('x', d => xScale(d.change5d))
        .attr('y', d => yScale(d.change20d))
        .attr('dy', '.35em')
        .text(d => d.sector.substring(0, 3))
        .on('click', function(event, d) {
            event.preventDefault();
            onBubbleClick(d);
        });

    // Add zoom and pan
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    // Reset zoom on double-click
    svg.on('dblclick.zoom', () => {
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(margin.left, margin.top));
    });

    // Add legend
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${margin.left + width - 150}, ${margin.top + 20})`);

    const statusTypes = ['主力', '輪動', '觀望', '退潮'];
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

    statusTypes.forEach((status, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 25})`);

        legendRow.append('circle')
            .attr('r', 6)
            .attr('class', `status-${status.toLowerCase().replace(/\s+/g, '-')}`);

        legendRow.append('text')
            .attr('x', 15)
            .attr('y', 4)
            .attr('font-size', '12px')
            .attr('fill', '#6b7280')
            .text(status);
    });
}

// Export for use in main.js
window.createBubbleChart = createBubbleChart;
