# Blueprint: Integration Test (Testing Library)

Technical reference for Angular Integration Testing.

## Key Features
- DOM-centric testing via `screen`.
- **Component Inputs**: Passed via `componentInputs` in `render`.
- **Dynamic Updates**: Using `fixture.componentRef.setInput()`.
- Mocks and Providers.

## Code Snippet

```typescript
describe('UserCardComponent', () => {
  it('should render initial inputs and update dynamically', async () => {
    // 1. Render with initial inputs
    const { fixture } = await render(UserCardComponent, {
      componentInputs: { 
        name: 'John Doe',
        role: 'Admin'
      }
    });

    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('Role: Admin')).toBeTruthy();

    // 2. Update inputs dynamically
    fixture.componentRef.setInput('name', 'Jane Smith');
    
    // Testing Library and Angular Signals handle the update
    expect(screen.getByText('Jane Smith')).toBeTruthy();
  });

  it('should handle async API calls with mocks', async () => {
    const mockService = {
      getData: vi.fn().mockReturnValue(of({ value: 'Success' }))
    };

    await render(DataComponent, {
      providers: [{ provide: DataService, useValue: mockService }]
    });

    const button = screen.getByRole('button', { name: /fetch/i });
    fireEvent.click(button);

    const result = await screen.findByText('Success');
    expect(result).toBeTruthy();
  });
});
```
