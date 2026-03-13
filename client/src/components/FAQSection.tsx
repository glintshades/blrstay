import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <section className="py-12 bg-card">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4" data-testid="text-faq-title">
            FAQ: Men's PG in Yelahanka | Boys Hostel Queries
          </h2>
          <p className="text-muted-foreground text-justify max-w-2xl mx-auto" data-testid="text-faq-description">
            Get answers to common questions about our affordable PG in Yelahanka. Whether you're looking for single sharing or double sharing rooms, food facilities, security features, or rent details—find all information about the best boys hostel in Yelahanka New Town right here.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full" data-testid="accordion-faq">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left" data-testid={`trigger-faq-${index}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-justify" data-testid={`content-faq-${index}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
