# Australian Tax Calculator

A web application for calculating Australian income tax. Built with Next.js and TypeScript.

## What it does

This calculator helps you estimate your Australian income tax based on current ATO rates. It handles:
- Multiple tax years (2022-23 to 2025-26)
- Different residency statuses (resident, non-resident, part-year)
- Medicare Levy calculations
- Stage 3 tax cuts for 2024-25 onwards

## Getting started

### Requirements
- Node.js 20 or higher
- npm, yarn, or pnpm

### Installation

Clone the repository:
```bash
git clone https://github.com/kelvindimson/visual-cortex-taxcalc
cd visual-cortex-taxcalc
```

Install dependencies:
```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run tests

```bash
npm run test
```

## Project structure

```
├── app/                  # Next.js app directory
│   ├── page.tsx         # Home page
│   └── api/             # API routes
├── components/          # React components
│   ├── TaxCalculator.tsx
│   ├── TaxCalculatorForm.tsx
│   └── TaxResultsSection.tsx
├── lib/                 # Core logic
│   ├── taxCalculator.ts
│   └── utils.ts
├── constants/           # Tax rates and configurations
├── models/              # Data validation schemas
└── hooks/               # Custom React hooks
```

## Key features

- **Accurate calculations**: Uses official ATO tax rates and brackets
- **Real-time validation**: Input validation with helpful error messages
- **Responsive design**: Works on desktop and mobile devices
- **Type-safe**: Full TypeScript coverage

## Technology stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Testing**: Jest
- **Deployment**: Docker, Kubernetes

## Docker

Build the Docker image:
```bash
docker build -t tax-calculator .
```

Run the container:
```bash
docker run -p 3000:3000 tax-calculator
```

Or use docker-compose:
```bash
docker-compose up prod
```

## Deployment

### Deploy to Kubernetes

Update the image registry in `k8s/deployment.yaml`, then:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

### Tax rates

Tax rates are configured in `constants/index.ts`. Update these when new rates are announced by the ATO.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a pull request

## Testing

The project includes comprehensive tests for tax calculations:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Check test coverage
npm run test:coverage
```

## License

MIT License - see LICENSE file for details.

## Disclaimer

This calculator provides estimates only. For accurate tax calculations, consult the ATO or a tax professional. Tax laws and rates change regularly.

## Support

For issues or questions, open an issue on GitHub or contact the maintainers.

## Links

- [Australian Taxation Office](https://www.ato.gov.au)
- [Tax rates and thresholds](https://www.ato.gov.au/rates/individual-income-tax-rates/)
- [Medicare Levy](https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy)